/**
 * @name         eval-input.js
 * @description  入力したJScriptコードを実行
 * @author       s_hiiragi (http://github.com/s-hiiragi)
 */

/**
 * ToDo:
 *   ・最後に入力したコードを次回の入力ダイアログの初期値にする
 * Future:
 *   ・コードを構文解析し、"fn"を"function"に展開する
 */


/** History
 * ----
 * ver 1.1 at 2012/06/07 07:04:40 JST
 *   Sakura-editor API(Editor.xxx)の"Editor."を省略可能にした
 *   Sakura-editor API Wrappersの"sakura."を省略可能にした
 *   よく使うActiveXObjectをあらかじめ使えるようにした
 *   
 * ver 1.0 at 2012/06/04 03:28:12 JST
 *   完成
 */


// Common Objects
var sh = new ActiveXObject('WScript.Shell'), 
	fso = new ActiveXObject('Scripting.FileSystemObject');

// Skura-editor API Wrappers
var sakura = {
	DIALOG_TITLE: 'Sakura-editor Macro'
};


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
	sh.Popup(String(message), 0, 
		sakura.DIALOG_TITLE + ': ' + sakura.SCRIPT_NAME, ICON_WARNING);
}

// 環境に依存したライブラリ
function log(message) {
	Editor.TraceOut(message);
}


// main

var code = prompt('code');
if (code) {
	with (Editor) {
		with (sakura) {
			var result = eval(code);
			if (result !== void(0)) {
				alert(result);
			}
		}
	}
}
