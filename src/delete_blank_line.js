/*
 * 空行を詰める
 */

var n = Editor.GetLineCount(0);

for (var i = 1; i <= n; ) {
    Editor.MoveCursor(i, 1, 0);
    var line = Editor.GetLineStr(i).replace(/^\s+|\s+$/g, '');
    if (line === '') {
        Editor.Delete();
        n = Editor.GetLineCount(0);
        continue;
    }
    i++;
}
