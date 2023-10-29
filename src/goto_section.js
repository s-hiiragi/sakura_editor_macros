/* �w�肵�����o���Ɉړ�
 *
 * �J�[�\���s�̎��̍s���猩�o������������
 * ���o���� 1.���S��v 2.������v �̏��Ɉ�v������̂�T��
 * ���o����T���ہA�啶��/�������͋�ʂ��Ȃ�
 *
 * �Ή����Ă��錩�o���t�H�[�}�b�g
 * - Markdown ('#'�Ŏn�܂�s)
 * - ���̑� ([���ʐݒ�]-[����]-[���o���L��]�̋L���Ŏn�܂�s)
 *
 * �����V���[�g�J�b�g�L�[: Alt+S
 */

function getSections(matcher) {
    var sections = [];

    var lineCount = Editor.GetLineCount(0);
    for (var i = 1; i <= lineCount; i++) {
        var line = Editor.GetLineStr(i).replace(/[\r\n]{1,2}$/, '');
        if (line && matcher.test(line)) {
            sections.push({
                text: matcher.exec(line)[1],
                line: i
            });
        }
    }

    return sections;
}

(function(){
    // �������錩�o������͂���
    var inputSection = Editor.InputBox('���o��', '', 100);
    if (!inputSection) return;

    // �g���q���ƂɌ��o���̒��o���@��ύX����
    var ext = Editor.ExpandParameter('$b');

    var matcher;
    if (/^(?:md|markdown)$/.test(ext)) {
        matcher = /^#+\s+(.*)/;
    } else {
        matcher = /^[�P�Q�R�S�T�U�V�W�X�O�i(�m[�u�w�y�������������������������E��������@�A�B�C�D�E�F�G�H�I�J�K�L�M�N�O�P�Q�R�S�T�U�V�W�X�Y�Z�[�\�]���O�l�ܘZ������\���Q��](.*)/;
    }

    // ���o���𒊏o����
    var sections = getSections(matcher);

    // �J�[�\���s+1���猩�o�����������邽�߂ɁA
    // �J�[�\���s+1�ȍ~�̍ŏ��̌��o������������
    var currentLine = Editor.ExpandParameter('$y');

    var startIndex = 0;
    for (var i = 0; i < sections.length; i++) {
        if (sections[i].line > currentLine) {
            startIndex = i;
            break;
        }
    }

    // ���S��v�Ō�������
    var sectionLine = null;

    for (var i = 0, j = startIndex; i < sections.length; i++) {
        var section = sections[j];

        if (section.text.toLowerCase() === inputSection.toLowerCase()) {
            sectionLine = section.line;
            break;
        }

        j++;
        if (j >= sections.length) {
            j = 0;
        }
    }

    // ������Ȃ���Ε�����v�Ō�������
    if (!sectionLine) {
        for (var i = 0, j = startIndex; i < sections.length; i++) {
            var section = sections[j];

            if (section.text.toLowerCase().indexOf(inputSection.toLowerCase()) >= 0) {
                sectionLine = section.line;
                break;
            }

            j++;
            if (j >= sections.length) {
                j = 0;
            }
        }
    }

    // ������Ȃ���ΏI������
    if (!sectionLine) {
        return;
    }

    // �����������o���s�փJ�[�\�����ړ�����
    Editor.MoveCursor(sectionLine, 1, 0);
})();
