// ==SakuraEditorScript==
// @name         rename_self.js
// @description  開いているファイルの名前を変更する
// @author       s_hiiragi (https://twitter.com/s_hiiragi)
// @version      1.0
// @lastupdate   2011-01-30T01:56:20-09:00
// ==/SakuraEditorScript==

/**
 * Done: 
 *   ・ファイル名を変更できる
 * ToDo: 
 *   ・未保存時、ファイル保存ダイアログを開いて保存させる
 * Future: 
 *   ・
 */

/**
 * プロンプトを表示
 * usage
 * var res = prompt(string message[, string default]);
 * @param  message  表示する文字列
 * @param  default  最初に入力されている文字列
 * @return  string  入力された文字列
 *                  ×ボタンで閉じたりキャンセルされた場合はnull
 */
(function(){
	var sc = new ActiveXObject('ScriptControl');
	sc.Language = 'VBScript';
	var func = [
		'Function InBox(message, title, default)', 
		'InBox = InputBox(message, title, default)', 
		'End Function'
	].join('\n');
	sc.AddCode(func);
	
	prompt = function(msg, def){
		var res = sc.Run('InBox', String(msg), 'サクラエディタ JScriptマクロ', def || '');
		return (res !== void(0) ? res : null);
	};
})();

var console = {
	log : function(m){
//		Editor.TraceOut(m);
	}
};

(function(){
	// 文書のパスを取得
	var docpath = Editor.GetFilename();
	console.log( '文書のパス' + docpath );

	// まだ1度も保存していない場合は保存
	if( !docpath ){
		// FileSave()では(無題)は保存出来ないらしい
		// エディタで上書き保存ボタンを押したときのような、ファイル名をつけて保存の
		// 挙動をしてくれるとうれしいのに…
//		Editor.FileSave();
		
		// ファイル保存ダイアログを開き、ファイル名を取得して保存
		// Editor.FileSaveAs(docpath, 99, 0);
		return;
	}

	// 新しい名前を入力
	var newname = prompt('新しいファイル名', docpath.replace(/^.*[\\\/]/, ''));
	if( !newname ){
		return;  // キャンセル
	}

	// 文書を保存し、閉じる
	Editor.FileSave();
	Editor.FileClose();

	// 文書名を変更
	var fso = new ActiveXObject('Scripting.FileSystemObject');
	var doc = fso.GetFile(docpath);
	console.log( doc.Name );

	doc.Name = newname;

	// 変更後のパスを取得
	var mod_docpath = doc.Path;
	console.log( '変更後のパス\n"' + mod_docpath + '"' );

	// 再度文書を開く
	Editor.FileOpen(mod_docpath);
})();
