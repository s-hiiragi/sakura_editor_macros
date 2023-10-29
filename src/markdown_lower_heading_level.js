/**
 * @file  見出しレベルを下げる
 *
 * - カーソル行の見出しレベルを1つ下げる (深くする)
 * - 子見出し、孫見出しのレベルも1つ下げる
 *
 * テスト用データ
 * ---
 * # 1
 * a
 * ## 2
 * b
 * ### 3
 * c
 * # 1
 * d
 * ---
 */

function isHeader(line) {
    return line.charAt(0) === '#';
}

function getHeaderLevel(line) {
    var i = 0;
    for (; i < line.length; i++) {
        if (line.charAt(i) != '#') {
            break;
        }
    }
    return i;
}

function lowerLevel(line) {
    return '#' + line;
}

(function(){

    Editor.AddRefUndoBuffer();
    Editor.AppendUndoBufferCursor();

    // 上方向にある直近の見出しまでカーソルを移動する

    var curLineX = Editor.ExpandParameter('$x');
    var curLineY = Editor.ExpandParameter('$y');

    var i = Editor.ExpandParameter('$y');
    for (; i > 1; i--) {
        var line = Editor.GetLineStr(i);

        if (isHeader(line)) {
            break;
        }

        Editor.Up();
    }

    var targetHeaderLevel = getHeaderLevel(Editor.GetLineStr(0));
    var targetHeaderLineY = i;

    // カーソル移動しながら見出しレベルを変更する

    var nLine = Editor.GetLineCount(0);
    for (var i = Editor.ExpandParameter('$y'); i <= nLine; i++) {
        var line = Editor.GetLineStr(i);

        if (!isHeader(line)) {
            Editor.MoveCursor(i+1, 1, 0);
            continue;
        }

        var level = getHeaderLevel(line);
        if (i != targetHeaderLineY && level <= targetHeaderLevel) {
            break;
        }

        line = lowerLevel(line);

        Editor.SelectLine(0);
        Editor.InsText(line);
    }

    // カーソル位置を戻す
    Editor.MoveCursor(curLineY, curLineX, 0);

    Editor.SetUndoBuffer();

})();
