/**
 * @file  ���͂���JScript�R�[�h�����s
 */

/**
 * ToDo:
 *   �E�Ō�ɓ��͂����R�[�h������̓��̓_�C�A���O�̏����l�ɂ���
 * Future:
 *   �E�R�[�h���\����͂��A"fn"��"function"�ɓW�J����
 */


/** History
 * ----
 * ver 1.1 at 2012/06/07 07:04:40 JST
 *   Sakura-editor API(Editor.xxx)��"Editor."���ȗ��\�ɂ���
 *   Sakura-editor API Wrappers��"sakura."���ȗ��\�ɂ���
 *   �悭�g��ActiveXObject�����炩���ߎg����悤�ɂ���
 *   
 * ver 1.0 at 2012/06/04 03:28:12 JST
 *   ����
 */


// Common Objects
var sh = new ActiveXObject('WScript.Shell'), 
	fso = new ActiveXObject('Scripting.FileSystemObject');

// Skura-editor API Wrappers
var sakura = {
	DIALOG_TITLE: 'Sakura-editor Macro'
};


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
	sh.Popup(String(message), 0, 
		sakura.DIALOG_TITLE + ': ' + sakura.SCRIPT_NAME, ICON_WARNING);
}

// ���Ɉˑ��������C�u����
function log(message) {
	Editor.TraceOut(message);
}


// main

var code = prompt('code');
if (code) {
	with (Editor) {
		with (sakura) {
			var result = eval(code);
			if (result !== void(0)) {
				alert(result);
			}
		}
	}
}
