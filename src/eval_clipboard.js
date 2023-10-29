/**
 * @file  クリップボードをマクロとして実行
 *
 * 推奨ショートカットキー: Shift+Alt+E
 */


// 開いているドキュメントの改行コード
/**
 * @type {string}
 */
var nl = ['\r\n', '\r', '\n'][Editor.GetLineCode()];

// 選択テキスト
/**
 * @type {string}
 */
var s = Editor.GetSelectedString(0);

/**
 * テキストをアウトプットタブへ出力
 *
 * @param {string} s - 文字列
 */
var p = function(s) { Editor.TraceOut(s); };

/**
 * テキストを挿入
 *
 * @param {string} s - 文字列
 */
var i = function(s) { Editor.InsText(s); };

/**
 * テキストを改行付きで挿入
 *
 * @param {string} s - 文字列
 */
var iln = function(s) { Editor.InsText(s + nl); };


(function(){
	Editor.AddRefUndoBuffer();

    eval(Editor.GetClipboard(0));

	Editor.SetUndoBuffer();
})();
