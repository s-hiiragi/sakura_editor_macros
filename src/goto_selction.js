/* �w�肵�����o���Ɉړ�
 *
 * ����
 * - Markdown����
 */

function getSections() {
    var sections = [];

    var lineCount = Editor.GetLineCount(0);
    for (var i = 1; i < lineCount; i++) {
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
    var inputSection = Editor.InputBox('���o��', '', 100);
    if (!inputSection) return;

    var sections = getSections();
    var sectionLine = null;

    // ���S��v
    for (var i = 0; i < sections.length; i++) {
        var section = sections[i];

        if (section.text === inputSection) {
            sectionLine = section.line;
            break;
        }
    }
    if (!sectionLine) {
        for (var i = 0; i < sections.length; i++) {
            var section = sections[i];

            if (section.text.indexOf(inputSection) >= 0) {
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