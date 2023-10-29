/**
 * @file  クリップボードをマクロとして実行
 *
 * マクロの中では以下の関数が使えます。
 *
 * function p(s: string);  // テキストをアウトプットタブへ出力
 * function i(s: string);  // テキストを挿入
 *
 * マクロの中では以下の変数が使えます。
 *
 * var s: string  // 選択テキスト
 *
 * 推奨ショートカットキー: Shift+Alt+E
 */

// utilities
var p = function(s) { Editor.TraceOut(s); };
var i = function(s) { Editor.InsText(s); };
var s = Editor.GetSelectedString(0);

var result = eval(Editor.GetClipboard(0));
if (typeof result !== 'undefined') {
	Editor.TraceOut(result);
}
