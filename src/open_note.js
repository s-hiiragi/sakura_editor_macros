/**
 * @file �m�[�g���J��
 *
 * ���O����
 *
 * - ���ϐ�`SAKURA_NOTEPATH`�ɁA�m�[�g(.md�t�@�C��)���i�[���ꂽ�t�H���_�̃p�X��ݒ肷��
 *
 * �����V���[�g�J�b�g�L�[: Alt+N
 */

/*
 * TODO �m�[�g��ʖ��ŊJ������
 * TODO �t�@�C�����Ɏg���Ȃ�������S�p�ɕϊ�������
 */

function trimExtension(path) {
    return path.replace(/\.[^\.]+$/, '');
}

function hasExtension(path) {
    return /\.[^.]+$/.test(path);
}

(function(){

    var wsh = new ActiveXObject('WScript.Shell');
    var noteDirPath = wsh.ExpandEnvironmentStrings('%SAKURA_NOTEPATH%');

	if (noteDirPath.charAt(0) === '%') {
		WarnMsg('���ϐ� SAKURA_NOTEPATH ��ݒ肵�Ă��������B');
		return;
	}

    var noteName = Editor.InputBox('�m�[�g��', '', 100);
    if (!noteName) return;

    var files = [];
    var fso = new ActiveXObject('Scripting.FileSystemObject');

    var noteDir = fso.GetFolder(noteDirPath);
    for (var e = new Enumerator(noteDir.Files); !e.atEnd(); e.moveNext()) {
        var f = e.item();
        files.push(f);
    }

    var notePath = null;

    // ���S��v������
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
        // ������v������
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
