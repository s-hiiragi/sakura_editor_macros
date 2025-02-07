/**
 * @file �m�[�g���J��
 *
 * ���O����
 *
 * - ���ϐ�`SAKURA_NOTEPATH`�ɁA�m�[�g(.md�t�@�C��)���i�[���ꂽ�t�H���_�̃p�X��ݒ肷��
 *
 * �e�m�[�g�̐擪�t�߂ɃG�C���A�X�����������ƂŁA�m�[�g���G�C���A�X���ŊJ�����Ƃ��ł���
 * 
 * �G�C���A�X�̐ݒ���@ (�ȗ���)
 * 
 * - �e�m�[�g�̐擪�t�߂�`alias: �G�C���A�X��1, �G�C���A�X��2, �c`�Ə���
 * - open_note_update_aliases.js�����s����
 *
 * �����V���[�g�J�b�g�L�[: Alt+N
 */

/*
 * TODO �t�@�C�����Ɏg���Ȃ�������S�p�ɕϊ�������
 */

var fso = new ActiveXObject('Scripting.FileSystemObject');
var wsh = new ActiveXObject('WScript.Shell');

function trimExtension(path) {
    return path.replace(/\.[^\.]+$/, '');
}

function hasExtension(path) {
    return /\.[^.]+$/.test(path);
}

// @return {[string]: string}
function readAliases(filepath) {
    var aliases = {};

    if (fso.FileExists(filepath)) {
        var file = fso.OpenTextFile(filepath, 1, false, -1);  // Unicode
        var lines = file.ReadAll().split(/\r?\n/);
        file.Close();

        var reading = false;
        for (var i = 0; i < lines.length; i++) {
            if (reading) {
                if (lines[i].charAt(0) === '[') {
                    break;
                }
                var pair = lines[i].split(/\s*=\s*/);
                var key = pair[0];
                var val = pair[1];
                if (key && val) {
                    aliases[key] = val;
                }
            }
            else {
                if (lines[i] === '[aliases]') {
                    reading = true;
                }
            }
        }
    }

    return aliases;
}

// @return {Path: string, Name: string}[]
function getFiles(folderPath) {
    var files = [];

    var dir = fso.GetFolder(folderPath);

    for (var e = new Enumerator(dir.Files); !e.atEnd(); e.moveNext()) {
        var f = e.item();
        files.push(f);
    }

    return files;
}

(function(){

    // �m�[�g�̂���f�B���N�g���̃p�X���擾

    var noteDirPath = wsh.ExpandEnvironmentStrings('%SAKURA_NOTEPATH%');

	if (noteDirPath.charAt(0) === '%') {
		WarnMsg('���ϐ� SAKURA_NOTEPATH ��ݒ肵�Ă��������B');
		return;
	}

	// �ݒ�t�@�C������m�[�g�̕ʖ���ǂݍ���

    var macroDir = fso.GetParentFolderName(Editor.ExpandParameter('$M'));
    var settingsFilePath = fso.BuildPath(macroDir, 'settings\\open_note.ini');
    var aliases = readAliases(settingsFilePath);

    // �J��or�쐬����m�[�g�������

    var noteName = Editor.InputBox('�m�[�g��', '', 100);
    if (!noteName) return;

    // �G�C���A�X��������Βu������

    if (aliases[noteName.toLowerCase()]) {
        noteName = aliases[noteName.toLowerCase()];
    }

    // �m�[�g�t�@�C���ꗗ���擾

    var files = getFiles(noteDirPath);

    // ���͂����m�[�g���Ɉ�v����m�[�g�t�@�C����T��

    var notePath = null;

    // 1. ���S��v������
    // �������A���֐��̂��߂ɁA
    // - �啶��/�������͋�ʂ��Ȃ�
    // - �g���q�Ȃ��Ŕ�r����
    for (var i = 0; i < files.length; i++) {
        var f = files[i];
        if (noteName.toLowerCase() === trimExtension(f.Name.toLowerCase())) {
            notePath = f.Path;
            break;
        }
    }
    if (!notePath) {
        // 2. ������v������
        // �������A
        // - �g���q���w�肳��Ă���ꍇ�͎����Ȃ�
        if (!hasExtension(noteName)) {
            for (var i = 0; i < files.length; i++) {
                var f = files[i];
                if (f.Name.toLowerCase().indexOf(noteName.toLowerCase()) >= 0) {
                    notePath = f.Path;
                    break;
                }
            }
        }
    }

    // �m�[�g���J��

    if (notePath) {
        Editor.FileOpen(notePath);
    } else {
        if (!hasExtension(noteName)) {
            noteName += '.md';
        }
        var notePath = fso.BuildPath(noteDirPath, noteName);
        Editor.FileOpen(notePath, 4/*UTF-8*/);
    }

})();
