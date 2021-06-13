/* 指定した見出しに移動
 *
 * 制限
 * - Markdown限定
 *
 * TODO
 * - 現在の行+1から検索する
 */

function getSections() {
    var sections = [];

    var lineCount = Editor.GetLineCount(0);
    for (var i = 1; i <= lineCount; i++) {
        var line = Editor.GetLineStr(i);
        if (line && line.charAt(0) === '#') {
            sections.push({
                text: line.replace(/^#+\s+|[\r\n]{1,2}$/g, ''),
                line: i
            });
        }
    }

    return sections;
}

(function(){
    var inputSection = Editor.InputBox('見出し', '', 100);
    if (!inputSection) return;

    var sections = getSections();
    var sectionLine = null;

    // 完全一致
    for (var i = 0; i < sections.length; i++) {
        var section = sections[i];

        if (section.text.toLowerCase() === inputSection.toLowerCase()) {
            sectionLine = section.line;
            break;
        }
    }
    if (!sectionLine) {
        // 部分一致
        for (var i = 0; i < sections.length; i++) {
            var section = sections[i];

            if (section.text.toLowerCase().indexOf(inputSection.toLowerCase()) >= 0) {
                sectionLine = section.line;
                break;
            }
        }
    }
    if (!sectionLine) {
        return;
    }

    Editor.MoveCursor(sectionLine, 1, 0);
})();
