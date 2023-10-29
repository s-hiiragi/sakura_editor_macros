/**
 * @file  (Markdown) カーソル位置の見出しと本文を切り取る
 *
 * 推奨ショートカットキー: Shift+Ctrl+X
 */

(function(){
    var n = Editor.GetLineCount(0);
    var y = Number(Editor.ExpandParameter('$y'));

    // 見出しを探す

    var i = y;
    var headerRow = null;

    for (; i >= 1; i--) {
        var line = Editor.GetLineStr(i);

        if (/^#+ /.test(line)) {
            headerRow = i;
            break;
        }
    }

    if (headerRow === null) {
        Editor.MsgBeep(4);
        return;
    }

    // 次の見出しを探す

    var i = y + 1;
    var nextHeaderRow = null;

    for (; i <= n; i++) {
        var line = Editor.GetLineStr(i);

        if (/^#+ /.test(line)) {
            nextHeaderRow = i;
            break;
        }
    }

    if (nextHeaderRow === null) {
        nextHeaderRow = n;
    }

    Editor.MoveCursor(headerRow, 1, 0);
    Editor.MoveCursor(nextHeaderRow, 1, 1);
    if (nextHeaderRow === n) {
        Editor.GoLineEnd_Sel();
    }
    Editor.Cut();
})();
