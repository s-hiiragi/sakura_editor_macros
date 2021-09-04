/**
 * @name         rename.js
 * @description  �t�@�C������ύX����
 * @author       s_hiiragi (http://github.com/s-hiiragi)
 */

/**
 * Usage
 * ----
 * �V�����t�@�C��������͂��A[OK]�{�^��������
 * ����: 
 *   "."�Ŏn�܂�t�@�C�����͈ȉ��̕������l�[�����Q�Ƃ̂���
 *   "."�ŏI���t�@�C�����ɂ̓��l�[���ł��Ȃ�
 * 
 * << �������l�[���@�\ >>
 * �ȉ��̏������g�����ƂŁA�g���q�������ȒP�Ƀ��l�[��������ł���
 * 
 * ���̃t�@�C����: hoge.txt
 * 
 * ���͕����� | �Ӗ�                      | ���l�[������
 * -----------|---------------------------|-------------
 * fuga       | �g���q���O��ύX        | hoge.txt => fuga.txt
 * fuga.      | �g���q�����̖��O�ɕύX    | hoge.txt => fuga
 * fuga.html  | �ʏ�̃��l�[��            | hoge.txt => fuga.html
 * .          | �g���q���폜              | hoge.txt => hoge
 * .html      | �g���q��ύX              | hoge.txt => hoge.html
 * \.fuga     | "."�Ŏn�܂閼�O�ɕύX     | hoge.txt => .fuga
 * /.fuga     | \.fuga�Ɠ���              | 
 *            |                           | 
 * /..        | "."�Ŏn�܂�{�g���q���폜 | hoge.txt => .hoge
 */

/* Tasks
 * ----
 * Done (Function List): 
 *   �E�t�@�C������ύX�ł��� (���ۑ��̏ꍇ�̓t�@�C���ۑ��_�C�A���O��\��)
 *   �E�x�[�X�l�[����(�g���q����������)������g���q������ύX�ł���
 * ToDo: 
 *   �E���͕�����̒ʉߏ����̃e�X�g���s��
 * Future (Difficult to implementation): 
 *   �E
 */

/* History
 * ----
 * ver 1.1 at 2012/06/07 06:56:48 JST
 *   "rename_self.js"����"rename.js"�ɖ��O�ύX
 *   �������l�[���@�\������
 *   �������l�[���@�\�̃e�X�g�R�[�h��ǉ�
 *   �e�X�g���₷���R�[�h�ɏ����Ȃ�����
 *   
 * ver 1.0 at 2011/01/30 01:56:20 JST
 *   ����
 */


// Common Objects
var wsh_shell = new ActiveXObject('WScript.Shell'), 
	fso = new ActiveXObject('Scripting.FileSystemObject');

/**
 * �t�@�C����������
 * 
 * @param {string} filename
 * @return {boolean} false: �s���ȃt�@�C����
 */
function validate_filename(filename)
{
	if (filename == '') {
		return false;
	}
	
	if (/[:*?"<>|\\\/]/.test(filename)) {  //"
		return false;
	}
	
	if (/^\.+$/.test(filename)) {  // Ex) ".", "..", �c
		return false;
	}
	
	return true;
}

// Sakura-editor API Wrappers
var sakura = {
	DIALOG_TITLE: 'Sakura-editor Macro', 
	
	SCRIPT_PATH: ExpandParameter('$M'), 
	
	save_as: function(filename) {
		var CURRENT_CHARSET = 99, 
			CURRENT_EOL = 0;
		Editor.FileSaveAs(filename, CURRENT_CHARSET, CURRENT_EOL);
	}
};
sakura.SCRIPT_NAME = fso.GetFileName(sakura.SCRIPT_PATH);


/**
 * �v�����v�g��\�� (DOM0 window.prompt)
 * var result = prompt(message[, default]);
 * 
 * @param {string} message �\�����镶����
 * @param {string} default �����l (�͂��߂ɓ��͂���Ă��镶����)
 *                  �ȗ������ꍇ�͋󕶎��� (����: ����API�ł�"undefined")
 * @return {string} ���͂��ꂽ������
 *                  �~�{�^���ŕ�����L�����Z�����ꂽ�ꍇ��null
 */
(function() {
	var sc = new ActiveXObject('ScriptControl');
	sc.Language = 'VBScript';
	var func = [
		'Function InBox(message, title, default)', 
		'InBox = InputBox(message, title, default)', 
		'End Function'
	].join('\n');
	sc.AddCode(func);
	
	prompt = function(message, default_value) {
		var result = sc.Run('InBox', String(message), sakura.DIALOG_TITLE, default_value || '');
		return (result !== void(0) ? result : null);
	};
})();

/** ���b�Z�[�W�{�b�N�X��\�� (DOM0 window.alert)
 * 
 * @param {string} message �\�����镶����
 */
function alert(message) {
	var ICON_WARNING = 48;
	wsh_shell.Popup(String(message), 0, 
		sakura.DIALOG_TITLE + ': ' + sakura.SCRIPT_NAME, ICON_WARNING);
}

/**
 * ���K�[ (Firebug Console API)
 * �K�v�Ȃ��̂̂ݎ���
 */
var console = {
	log: function(m) {
//		Editor.TraceOut(m);
	}
};


// main

function input_newname_format(old_name) {
	var old_base = old_name.split('.')[0];
	
	var message = [  // �\���ł��郁�b�Z�[�W���Ɍ��肪���������߁A������؂�l�߂�
			'�V�����t�@�C��������͂��Ă��������B', 
			'', 
			'���̃t�@�C����: A.txt', 
			'', 
			'����  | �Ӗ�                   | ����', 
			'------|------------------------|------', 
			'B     | �g���q���O��ύX     | B.txt', 
			'B.    | �g���q�����̖��O�ɕύX | B', 
			'B.htm | �ʏ�̃��l�[��         | B.htm', 
			'.     | �g���q���폜           | B', 
			'.htm  | �g���q��ύX           | A.htm', 
			'\\.B   | "."�Ŏn�܂閼�O�ɕύX  | .B', 
			'/.B   | \\.B�Ɠ���              | .B', 
			'/..   | /.��.�̕���            | .A'
		].join('\n');
	var input_name;
	do {
		var input_name = prompt(message, old_base);
		if ( !input_name ) return;
		
		// �t�@�C�������s���ȏꍇ�͍ēx����
		if (input_name == '.') break;  // "."��ok
		var matches = /^[\\\/]\.(.*)$/.exec(input_name);  // \\.hoge, /.hoge��ok
		if (matches) {
			if (matches[1] == '.') break;  // "\..", "/.."��ok
			if ( !validate_filename(matches[1]) ) continue;
		} else {
			if ( !validate_filename(input_name) ) continue;
		}
	}
	while (0);
	
	return input_name;
}

function rename_according_to_format(old_name, format) {
	/**
	 * @param {string} format
     *
	 *     | format    | old_name => new_name   | comment                                                              |
	 *     | --------- | --------------------------------------------------------------------------------------------- |
	 *     | fuga      | hoge.ext => fuga.ext   | Change the basename                                                  |
	 *     | fuga.ext2 | hoge.ext => fuga.ext2  | Change the basename and the extension                                |
	 *     | fuga.     | hoge.ext => fuga       | Change the basename and *remove* the extension                       |
	 *     | .ext2     | hoge.ext => hoge.ext2  | Rename extension                                                     |
	 *     | .         | hoge.ext => hoge       | *Remove* extension                                                   |
	 *     | \.fuga    |                        |                                                                      |
	 *     | /.fuga    | hoge.ext => .fuga      | Change the old name to a hidden file name                            |
	 *     | /..       | hoge.ext => .hoge      | Change the basename to a hidden file name and *remove* the extension |
	 *     | /..ext2   | hoge.ext => .hoge.ext2 | Change the basename to a hidden file name and rename the extension   |
	 */

	var _pair = old_name.split('.'), 
		old_base = _pair[0], 
		old_ext  = _pair[1] ? '.'+_pair[1] : '';

	var matches = /^([\\\/]\.)?([^.]*)(\.(.*))?$/.exec(format), 
		new_base = (matches[1] ? '.': '') + (matches[2] || old_base), 
		new_ext  = (matches[3] ? (matches[4] ? '.'+matches[4] : '') : old_ext), 
		new_name = new_base + new_ext;
	
	return new_name;
}

(function() {
	/* Test
	var _log = [];
	function assert_eq(lhs, rhs) {
		if (lhs != rhs) _log.push('Failed: ' + lhs + ' != ' + rhs);
	}
	function report() {
		alert( _log.length == 0 ? 'All ok.' : _log.join('\n') );
	}
	
	// ����n
	assert_eq( rename_according_to_format('hoge.txt', 'fuga'),     'fuga.txt'  );
	assert_eq( rename_according_to_format('hoge.txt', 'fuga.'),    'fuga'      );
	assert_eq( rename_according_to_format('hoge.txt', 'fuga.htm'), 'fuga.htm'  );
	assert_eq( rename_according_to_format('hoge.txt', '.'),        'hoge'      );
	assert_eq( rename_according_to_format('hoge.txt', '.htm'),     'hoge.htm'  );
	assert_eq( rename_according_to_format('hoge.txt', '\\.fuga'),  '.fuga.txt' );
	assert_eq( rename_according_to_format('hoge.txt', '/.fuga'),   '.fuga.txt' );
	assert_eq( rename_according_to_format('hoge.txt', '\\..'),     '.hoge'     );
	assert_eq( rename_according_to_format('hoge.txt', '/..'),      '.hoge'     );
	assert_eq( rename_according_to_format('hoge.txt', '\\..htm'),  '.hoge.htm' );
	assert_eq( rename_according_to_format('hoge.txt', '/..htm'),   '.hoge.htm' );
	
	// �ُ�n
	
	report();
	return;
	//*/
	
	
	var doc_path = Editor.GetFilename(), 
		doc_name = fso.GetFileName(doc_path);
	
	console.log([
			  'doc_path: ' + doc_path, 
			+ 'doc_name: ' + doc_name
		].join('\n'));
	
	// ���ۑ��̏ꍇ�A�t�@�C���ۑ��_�C�A���O���J��
	if( !doc_path ) {
		Editor.FileSave();
		return;
	}
	
	// �ʖ��ŕۑ�
	var new_name = rename_according_to_format(doc_name, input_newname_format(doc_name) );
	if (new_name == doc_name) return;
	
	sakura.save_as(new_name);
	
	// ���O�ύX�O�̃t�@�C�����폜
	fso.DeleteFile(doc_path);
})();
