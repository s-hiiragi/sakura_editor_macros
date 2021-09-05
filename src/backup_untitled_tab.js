/**
 * @file     サクラエディタの新規タブ内容のバックアップを支援する
 * @author   s_hiiragi <https://github.com/s-hiiragi>
 * @version  2.0
 *
 * @description
 * <p>
 *   サクラエディタにはファイルの自動保存機能があるため、予期せぬWindowsの終了
 *   に対して有効です。しかし、新規作成直後の(無題)タブはファイルとして保存され
 *   ていないため、自動保存機能で保存されず予期せぬWindowsの終了によって内容が
 *   永久に失われます。
 * </p><p>
 *   この問題を解決するために、このマクロは新規作成直後に(無題)タブの内容を一
 *   時ファイルに保存します。
 * </p><p>
 *   マクロの登録方法
 *   <ol>
 *     <li>メニューの[設定]-[共通設定]を開きます。</li>
 *     <li>マクロタブを選択します。</li>
 *     <li>本ファイルを置いたフォルダのパスをマクロ一覧の横のテキストボックスに入力します。</li>
 *     <li>参照ボタンを押してフォルダを選択しても構いません。</li>
 *     <li>リストから空いている番号の行をクリックして選択します。</li>
 *     <li>下の方の名前に「リネーム」を、Fileに「backup_untitled_tab.js」を入力します。</li>
 *     <li>自動実行:の横の「新規／開ファイル後」にチェックを入れます。</li>
 *     <li>設定ボタンを押します。</li>
 *     <li>OKボタンを押してダイアログを閉じます。</li>
 *   </ol>
 * </p><p>
 *   サクラエディタの必要バージョン: 2.0.0.2 以上
 * </p>
 */

/*
 * 更新履歴
 *   version 2.0
 *     "sakura.exe.ini"で指定されたユーザーフォルダに一時ファイルを保存するよう
 *     に変更
 *   version 1.0
 *     完成
 */
(function () {
	var UNTITLED_DIR_NAME = 'untitled_files';
	var UNTITLED_PARENT_DIR = null;  // デフォルト = "sakura.exe"の存在するディレクトリ
	var UNTITLED_FILE_PREFIX = '無題_';
	
	var DEFAULT_CHARSET = 4;  // UTF-8
	var DEFAULT_NEWLINE = 1;  // CRLF
	
	var fso = new ActiveXObject('Scripting.FileSystemObject');
	var wsh_shell = new ActiveXObject('WScript.SHell');
	
	
	// 無題タブかどうかチェック
	if (Editor.GetFilename() != '') return;
	
	var untitled_dir = UNTITLED_PARENT_DIR || fso.buildPath(get_user_dir(), UNTITLED_DIR_NAME);
	
	var save_index = -1;
	if (fso.folderExists(untitled_dir)) {
		// 若い添え字から順にファイルオープン可能か調べ、ファイルが存在しない
		// orロックされてない添え字を取得
		
		for (var i=0; i < 64; ++i) {  // 暴走防止のため、あえて制限を課しておく
			var save_path = fso.buildPath(untitled_dir, UNTITLED_FILE_PREFIX + i);
			
			if (!fso.fileExists(save_path)) {
				save_index = i;
				break;
			}
			try {
				var f = fso.openTextFile(save_path, 2);
				f.close();
				
				save_index = i;
				break;
			}
			catch (e) {
				// ファイルを書込みモードで開けない = 編集中と判断し、次の添字の
				// ファイルオープンを試す
			}
		}
		if (save_index == -1) {
			wsh_shell.popup(
				'無題ファイル数の制限に達したため保存できませんでした', 0, 
				'サクラエディタマクロ - '
					+ fso.getFileName(Editor.ExpandParameter('$M')), 0 + 48);
			return;
		}
	}
	else {
		fso.createFolder(untitled_dir);
		save_index = 0;  // 無題ファイルが存在しないことは分かっているので0番目
	}
	
	// 無題ファイルを保存
	var save_path = fso.buildPath(untitled_dir, UNTITLED_FILE_PREFIX + save_index);
	Editor.FileSaveAs(save_path, DEFAULT_CHARSET, DEFAULT_NEWLINE);
	
	
	function get_user_dir() {
		var sakura_path = Editor.ExpandParameter('$S');
		var sakura_dir = fso.getParentFolderName(sakura_path);
		var sakura_ini = sakura_path + '.ini';
		
		var ret = sakura_dir;
		if (fso.fileExists(sakura_ini)) {
			var ini = read_ini(sakura_ini);
			
			if (ini.Settings.MultiUser == 1) {
				var base_dir = null;
				
				switch (Number(ini.Settings.UserRootFolder)) {
				case 0: /* shell:AppData  */ base_dir = wsh_shell.expandEnvironmentStrings('%AppData%'); break;
				case 1: /* shell:Profile  */ base_dir = wsh_shell.expandEnvironmentStrings('%UserProfile%'); break;
				case 2: /* shell:Personal */ base_dir = wsh_shell.specialFolders('MyDocuments'); break;
				case 3: /* shell:Desktop  */ base_dir = wsh_shell.specialFolders('Desktop'); break;
				default:
					throw new Error('Unreachable Error: UserRootFolder = ' + ini.Settings.UserRootFolder);
				}
				ret = fso.buildPath(base_dir, ini.Settings.UserSubFolder);
			}
		}
		return ret;
	}
	
	function read_ini(filename) {
		var f = fso.openTextFile(filename);
		var lines = f.readAll().split(/\r\n?|\n/);
		f.close();
		
		// for parsing
		var re_sect = new RegExp();
		re_sect.compile('^\\[([^\\]]+)\\]$');
		var re_kv = new RegExp();
		re_kv.compile('^([^=]+)\\s*=\\s*(.*)$');
		
		var ret = {}, sect = '';
		for (var i = 0, l = lines.length; i < l; ++i) {
			var line = lines[i].replace(/^\s+|\s+$/g, '');
			
			if (line === '' || line.charAt(0) === ';')  // empty line | linear comment
				continue;
			
			if (re_sect.test(line)) {  // [ section ]
				sect = re_sect.exec(line)[1];
				ret[sect] = {};
			}
			else if (re_kv.test(line)) {  // key = value
				var m = re_kv.exec(line), 
					key = m[1], val = m[2];
				(sect ? ret[sect] : ret)[key] = val;
			}
			else {  // unknown format
				throw new Error('IniParseError: at line ' + i + ', "' + line.replace(/\"/g, '\\"') + '"');  // "
			}
		}
		
		return ret;
	}
	
})();
