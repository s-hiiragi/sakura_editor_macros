/**
 * @name         rename.js
 * @description  ファイル名を変更する
 * @author       s_hiiragi (http://github.com/s-hiiragi)
 */

/**
 * Usage
 * ----
 * 新しいファイル名を入力し、[OK]ボタンを押す
 * 注意: 
 *   "."で始まるファイル名は以下の部分リネームを参照のこと
 *   "."で終わるファイル名にはリネームできない
 * 
 * << 部分リネーム機能 >>
 * 以下の書式を使うことで、拡張子だけを簡単にリネームしたりできる
 * 
 * 元のファイル名: hoge.txt
 * 
 * 入力文字列 | 意味                      | リネーム結果
 * -----------|---------------------------|-------------
 * fuga       | 拡張子より前を変更        | hoge.txt => fuga.txt
 * fuga.      | 拡張子無しの名前に変更    | hoge.txt => fuga
 * fuga.html  | 通常のリネーム            | hoge.txt => fuga.html
 * .          | 拡張子を削除              | hoge.txt => hoge
 * .html      | 拡張子を変更              | hoge.txt => hoge.html
 * \.fuga     | "."で始まる名前に変更     | hoge.txt => .fuga
 * /.fuga     | \.fugaと同じ              | 
 *            |                           | 
 * /..        | "."で始まる＋拡張子を削除 | hoge.txt => .hoge
 */

/* Tasks
 * ----
 * Done (Function List): 
 *   ・ファイル名を変更できる (未保存の場合はファイル保存ダイアログを表示)
 *   ・ベースネーム部(拡張子を除く部分)だけや拡張子だけを変更できる
 * ToDo: 
 *   ・入力文字列の通過条件のテストを行う
 * Future (Difficult to implementation): 
 *   ・
 */

/* History
 * ----
 * ver 1.1 at 2012/06/07 06:56:48 JST
 *   "rename_self.js"から"rename.js"に名前変更
 *   部分リネーム機能を実装
 *   部分リネーム機能のテストコードを追加
 *   テストしやすいコードに書きなおした
 *   
 * ver 1.0 at 2011/01/30 01:56:20 JST
 *   完成
 */


// Common Objects
var wsh_shell = new ActiveXObject('WScript.Shell'), 
	fso = new ActiveXObject('Scripting.FileSystemObject');

/**
 * ファイル名を検証
 * 
 * @param {string} filename
 * @return {boolean} false: 不正なファイル名
 */
function validate_filename(filename)
{
	if (filename == '') {
		return false;
	}
	
	if (/[:*?"<>|\\\/]/.test(filename)) {  //"
		return false;
	}
	
	if (/^\.+$/.test(filename)) {  // Ex) ".", "..", …
		return false;
	}
	
	return true;
}

// Sakura-editor API Wrappers
var sakura = {
	DIALOG_TITLE: 'Sakura-editor Macro', 
	
	SCRIPT_PATH: ExpandParameter('$M'), 
	
	save_as: function(filename) {
		var CURRENT_CHARSET = 99, 
			CURRENT_EOL = 0;
		Editor.FileSaveAs(filename, CURRENT_CHARSET, CURRENT_EOL);
	}
};
sakura.SCRIPT_NAME = fso.GetFileName(sakura.SCRIPT_PATH);


/**
 * プロンプトを表示 (DOM0 window.prompt)
 * var result = prompt(message[, default]);
 * 
 * @param {string} message 表示する文字列
 * @param {string} default 初期値 (はじめに入力されている文字列)
 *                  省略した場合は空文字列 (注意: 元のAPIでは"undefined")
 * @return {string} 入力された文字列
 *                  ×ボタンで閉じたりキャンセルされた場合はnull
 */
(function() {
	var sc = new ActiveXObject('ScriptControl');
	sc.Language = 'VBScript';
	var func = [
		'Function InBox(message, title, default)', 
		'InBox = InputBox(message, title, default)', 
		'End Function'
	].join('\n');
	sc.AddCode(func);
	
	prompt = function(message, default_value) {
		var result = sc.Run('InBox', String(message), sakura.DIALOG_TITLE, default_value || '');
		return (result !== void(0) ? result : null);
	};
})();

/** メッセージボックスを表示 (DOM0 window.alert)
 * 
 * @param {string} message 表示する文字列
 */
function alert(message) {
	var ICON_WARNING = 48;
	wsh_shell.Popup(String(message), 0, 
		sakura.DIALOG_TITLE + ': ' + sakura.SCRIPT_NAME, ICON_WARNING);
}

/**
 * ロガー (Firebug Console API)
 * 必要なもののみ実装
 */
var console = {
	log: function(m) {
//		Editor.TraceOut(m);
	}
};


// main

function getname(doc_name) {
	var doc_base = doc_name.split('.')[0];
	
	var message = [  // 表示できるメッセージ幅に限りがあったため、文字を切り詰めた
			'新しいファイル名を入力してください。', 
			'', 
			'元のファイル名: A.txt', 
			'', 
			'入力  | 意味                   | 結果', 
			'------|------------------------|------', 
			'B     | 拡張子より前を変更     | B.txt', 
			'B.    | 拡張子無しの名前に変更 | B', 
			'B.htm | 通常のリネーム         | B.htm', 
			'.     | 拡張子を削除           | B', 
			'.htm  | 拡張子を変更           | A.htm', 
			'\\.B   | "."で始まる名前に変更  | .B', 
			'/.B   | \\.Bと同じ              | .B', 
			'/..   | /.と.の複合            | .A'
		].join('\n');
	var input_name;
	do {
		var input_name = prompt(message, doc_base);
		if ( !input_name ) return;
		
		// ファイル名が不正な場合は再度入力
		if (input_name == '.') break;  // "."はok
		var matches = /^[\\\/]\.(.*)$/.exec(input_name);  // \\.hoge, /.hogeはok
		if (matches) {
			if (matches[1] == '.') break;  // "\..", "/.."はok
			if ( !validate_filename(matches[1]) ) continue;
		} else {
			if ( !validate_filename(input_name) ) continue;
		}
	}
	while (0);
	
	return input_name;
}

function rename(old_name, input_name) {
	var _pair = old_name.split('.'), 
		old_base = _pair[0], 
		old_ext  = _pair[1] ? '.'+_pair[1] : '';
	
	// fuga      : hoge.ext => fuga.ext  (Rename Basename)
	// fuga.     : hoge.ext => fuga      (Rename Basename and Remove Extension)
	// fuga.ext2 : hoge.ext => fuga.ext2 (Rename Basename and Extension)
	// .         : hoge.ext => hoge      (Remove Extension)
	// .ext2     : hoge.ext => hoge.ext2 (Rename Extension)
	// \.fuga    : 
	// /.fuga    : hoge.ext => .fuga     (Hidden File for UNIX)
	// 
	// (Advanced)
	// /..       : hoge.ext => .hoge
	// /..ext2   : hoge.ext => .hoge.ext2
	
	var matches = /^([\\\/]\.)?([^.]*)(\.(.*))?$/.exec(input_name), 
		new_base = (matches[1] ? '.': '') + (matches[2] || old_base), 
		new_ext  = (matches[3] ? (matches[4] ? '.'+matches[4] : '') : old_ext), 
		new_name = new_base + new_ext;
	
	return new_name;
}

(function() {
	/* Test
	var _log = [];
	function assert_eq(lhs, rhs) {
		if (lhs != rhs) _log.push('Failed: ' + lhs + ' != ' + rhs);
	}
	function report() {
		alert( _log.length == 0 ? 'All ok.' : _log.join('\n') );
	}
	
	// 正常系
	assert_eq( rename('hoge.txt', 'fuga'),     'fuga.txt'  );
	assert_eq( rename('hoge.txt', 'fuga.'),    'fuga'      );
	assert_eq( rename('hoge.txt', 'fuga.htm'), 'fuga.htm'  );
	assert_eq( rename('hoge.txt', '.'),        'hoge'      );
	assert_eq( rename('hoge.txt', '.htm'),     'hoge.htm'  );
	assert_eq( rename('hoge.txt', '\\.fuga'),  '.fuga.txt' );
	assert_eq( rename('hoge.txt', '/.fuga'),   '.fuga.txt' );
	assert_eq( rename('hoge.txt', '\\..'),     '.hoge'     );
	assert_eq( rename('hoge.txt', '/..'),      '.hoge'     );
	assert_eq( rename('hoge.txt', '\\..htm'),  '.hoge.htm' );
	assert_eq( rename('hoge.txt', '/..htm'),   '.hoge.htm' );
	
	// 異常系
	
	report();
	return;
	//*/
	
	
	var doc_path = Editor.GetFilename(), 
		doc_name = fso.GetFileName(doc_path);
	
	console.log([
			  'doc_path: ' + doc_path, 
			+ 'doc_name: ' + doc_name
		].join('\n'));
	
	// 未保存の場合、ファイル保存ダイアログを開く
	if( !doc_path ) {
		Editor.FileSave();
		return;
	}
	
	// 別名で保存
	var new_name = rename(doc_name, getname(doc_name) );
	if (new_name == doc_name) return;
	
	sakura.save_as(new_name);
	
	// 名前変更前のファイルを削除
	fso.DeleteFile(doc_path);
})();
