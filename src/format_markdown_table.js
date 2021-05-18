/*
 * format_markdown_table.js
 *
 * 概要
 * - Markdownの表を整形する
 *
 * 使用方法
 * - Markdownの表のいずれかの行にカーソルを置いてマクロを実行する
 */

function isTableLine(line) {
    return line.indexOf('|') >= 0;
}

function isDelimiterLine(line) {
    return /^\|?-+(\|-+)*\|?$/.test(line.replace(/\s+/g, ''));
}

function getFields(line) {
    return line.replace(/^\s+|\s+$/g, '')
        .replace(/\s*\|\s*/g, '|')  // to avoid split bug
        .split('|');
}

function calculateWidth(str) {
    var width = 0;
    for (var i = 0; i < str.length; i++) {
        width += str.charCodeAt(i) <= 0xFF ? 1 : 2;
    }
    return width;
}

function repeatString(str, n) {
    var result = '';
    for (var i = 0; i < n; i++) {
        result += str;
    }
    return result;
}

// TODO workに反映
function trimHorizontalFrame(lines) {
    var trimmedLines = [];
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].replace(/^\s+|\s+$/g, '');
        if (!/^\||\|$/.test(line)) {
            return lines;
        }
        line = line.replace(/^\|\s*|\s*\|$/g, '');
        trimmedLines.push(line);
    }
    return trimmedLines;
}

(function(){

    var line = Editor.GetLineStr(0);
    if (!isTableLine(line)) {
        return;
    }

    // 表の開始行を探す
    var numCurrent = Editor.ExpandParameter('$y');
    var numStart = numCurrent;
    for (var i = numStart; i >= 1; i--) {
        var line = Editor.GetLineStr(i);
        if (!isTableLine(line)) {
            numStart = i + 1;
            break;
        }
    }
    if (i == 0) {
        numStart = 1;
    }

    // 表の終了行を探す
    var numEnd = numCurrent;
    var maxLine = Editor.GetLineCount(0);
    for (var i = numEnd; i <= maxLine; i++) {
        var line = Editor.GetLineStr(i);
        if (!isTableLine(line)) {
            numEnd = i - 1;
            break;
        }
    }
    if (i == maxLine + 1) {
        numEnd = maxLine;
    }

    // 1行しかない場合は表と見做さない
    if (numStart === numEnd) {
        return;
    }

    /* DEBUG
    traceout = 'numStart=' + numStart + ', numEnd=' + numEnd + ', maxLine=' + maxLine;
    //return;
    //*/

    // 表の行を取得する
    var tableLines = [];
    for (var i = numStart; i <= numEnd; i++) {
        var line = Editor.GetLineStr(i);

        // デリミタ行は読み飛ばす
        if (isDelimiterLine(line)) {
            continue;
        }

        tableLines.push(line);
    }

    // 表の横枠を削除する
    tableLines = trimHorizontalFrame(tableLines)

    // 各行のフィールドを取得する
    var fieldsOfLines = [];  // number[][]
    for (var i = 0; i < tableLines.length; i++) {
        var line = tableLines[i];

        var fields = getFields(line);
        fieldsOfLines.push(fields);
    }

    // 各行のフィールド数が同じになるように空文字列を追加する
    var maxFields = 0;
    for (var i = 0; i < fieldsOfLines.length; i++) {
        var fields = fieldsOfLines[i];
        if (fields.length > maxFields) {
            maxFields = fields.length;
        }
    }
    for (var i = 0; i < fieldsOfLines.length; i++) {
        var fields = fieldsOfLines[i];
        for (var j = 0; j < maxFields; j++) {
            if (typeof fields[j] === 'undefined') {
                fields[j] = '';
            }
        }
    }

    // 各フィールドの文字幅(半角単位)を計算する
    var maxWidths = [];
    for (var i = 0; i < maxFields; i++) {
        maxWidths[i] = 1;  // 最低幅数
    }

    for (var i = 0; i < fieldsOfLines.length; i++) {
        var fields = fieldsOfLines[i];
        for (var j = 0; j < fields.length; j++) {
            var w = calculateWidth(fields[j]);
            maxWidths[j] = Math.max(maxWidths[j], w);
        }
    }

    // これ以降Undoバッファを1つにまとめる
    Editor.AddRefUndoBuffer();

    // 以前の表を削除する
    Editor.MoveCursor(numStart, 1, 0);
    for (var i = numStart; i <= numEnd; i++) {
        Editor.DeleteLine();
    }

    // 表を挿入する
    var lines = [];
    for (var i = 0; i < fieldsOfLines.length; i++) {
        var fields = fieldsOfLines[i];

        // デリミタ行を挿入する
        if (i == 1) {
            var delimiters = [];
            for (var j = 0; j < fields.length; j++) {
                delimiters[j] = repeatString('-', maxWidths[j]);
            }
            var line = '| ' + delimiters.join(' | ') + ' |';
            lines.push(line);
        }

        for (var j = 0; j < fields.length; j++) {
            var w = calculateWidth(fields[j]);
            fields[j] += repeatString(' ', maxWidths[j] - w);
        }
        var line = '| ' + fields.join(' | ') + ' |';
        lines.push(line);
    }

    var newLine = ['\r\n', '\r', '\n'][Editor.GetLineCode(0)];
    var text = lines.join(newLine) + newLine;
    Editor.InsText(text);

    SetUndoBuffer();

})();
