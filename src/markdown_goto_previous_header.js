﻿/**
 * @file  (Markdown) 前の見出しに移動
 *
 * 推奨ショートカットキー: Ctrl+↑
 *
 * 備考
 *
 * - コードブロック中の`#`で始まる行にもマッチしてしまうが、
 *   現在行がコードブロック中かどうか確実に判定する方法が無いため、妥協する。
 */

(function(){
    var n = Editor.GetLineCount(0);
    var i = Number(Editor.ExpandParameter('$y')) - 1;
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

    var x = Number(Editor.ExpandParameter('$x'));
    Editor.MoveCursor(headerRow, x, 0);
})();
