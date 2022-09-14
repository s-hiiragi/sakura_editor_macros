/*
 * (Markdown) チェックボックスの状態を変更する
 *
 * 参考
 *
 * - [5.3 Task list items (extension)](https://github.github.com/gfm/#task-list-items-extension-)
 */

(function(){
    var newLine = ['\r\n', '\r', '\n'][Editor.GetLineCode()];

    var currentLine = Editor.GetLineStr(0).replace(/\r?\n$/, '');

    var m = /^(\s*-\s*\[)([ xX])(\] .*)/.exec(currentLine);
    if (!m) { return; }

    var replacedLine = m[1] + (m[2] === ' ' ? 'x' : ' ') + m[3] + newLine;

    var x = Editor.ExpandParameter('$x');
    var y = Editor.ExpandParameter('$y');

    Editor.SelectLine(0);
    Editor.InsText(replacedLine);

    // カーソルが改行の後ろに移動するので元に戻す
    Editor.MoveCursor(y, x, 0);
})();
