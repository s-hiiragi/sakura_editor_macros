/**
 * @file  選択範囲の各行に見出し番号(連番)を挿入
 */

function calcKeta(n) {
    var keta = 1;
    while (n >= 10) {
        keta++;
        n /= 10;
    }
    return keta;
}

function repeatString(s, n) {
    var result = '';
    for (var i = 0; i < n; i++) {
        result += s;
    }
    return result;
}

var startLine = Editor.GetSelectLineFrom();
var endLine = Editor.GetSelectLineTo();

var maxNum = endLine - startLine + 1;
var keta = calcKeta(maxNum);
var zeros = repeatString('0', keta);

AddRefUndoBuffer();

for (var i = 0; i < maxNum; i++) {
    Editor.MoveCursor(startLine + i, 1, 0);
    Editor.InsText((zeros + String(i + 1)).slice(-keta) + '. ');
}

SetUndoBuffer();
