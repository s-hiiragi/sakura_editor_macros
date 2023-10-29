/**
 * @file  �I���e�L�X�g������
 */

/* �g����
 *   => modules/spin_seltext.js ���Q�ƁB
 */

var print; // [[Global]].Print(Editor.Print)��"common.js"��print()�̏Փ˂����

function load(rel_module_path) {
	if (load.__debug) {
		Editor.TraceOut('load: ' + rel_module_path);
	}
	var modulepath;
	var __code = (function() {
		var fso = new ActiveXObject('Scripting.FileSystemObject');
		var module_dir = fso.BuildPath(
				fso.GetParentFolderName(Editor.ExpandParameter('$M')), 'modules');
		var abs_module_path = fso.GetAbsolutePathName(
				fso.BuildPath(module_dir, rel_module_path));
		
		modulepath = abs_module_path;
		
		// �ǂݍ��ݍς݃��W���[���̓ǂݍ��݂��X�L�b�v����
		var normalized_path = abs_module_path.substring(module_dir.length).replace(/^\\/, '');
		load._loaded || (load._loaded = {});
		if (load._loaded[normalized_path]) {
			return;
		}
		load._loaded[normalized_path] = true;
		return fso.OpenTextFile(abs_module_path).ReadAll();
	})();
	if (!__code) return;
	// ���W���[������O�����J�����I�u�W�F�N�g��exports�ɏW�߂���
	var exports = {};
	try {
		with (exports) {
			eval(__code);
		}
	} catch (ex) {
		Editor.TraceOut(ex);
		throw ex;
	}
	// exports�ɏW�߂�ꂽ�I�u�W�F�N�g���O���[�o���ϐ��Ƃ��Č��J����
	for (var k in exports) {
		if (k[0] != '_') { // '_'�Ŏn�܂閼�O�͊O�����J���X�L�b�v����
			new Function('v', k + '=v')(exports[k]); // k=v �����s����(�O���[�o���ϐ��ւ̏�����)
		}
	}
}

(function() {
	load('common.js');
	
	macro_args = { delta: 1 };
	load('spin_seltext.js');
})();
