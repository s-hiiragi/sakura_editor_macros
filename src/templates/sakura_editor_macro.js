/**
 * @file    �T�N���G�f�B�^�}�N���̃e���v���[�g
 * @author  s_hiiragi (https://github.com/s-hiiragi)
 */

// [[Global]].xxx(Editor.xxx)�Ɠ����̃I�u�W�F�N�g���O�����J�����
// [[Global]].xxx���Ă΂�Ă��܂���肪���邽�߁A�ȉ��̂悤�ɗ\�߃��[�J���ϐ���
// ��`���邱�Ƃŉ������B
// (���̂�[[Global]].xxx(Editor.xxx)�ɒl��������Ɗ֐��Ăяo�����Ă��܂�)
// 
var print; // [[Global]].Print(Editor.Print)��"common.js"��print()�̏Փ˂����

/**
 * load(rel_module_path)
 * �T�N���G�f�B�^�}�N�����W���[���t�@�C����ǂݍ��ݎ��s����.
 * 
 * rel_module_path : string
 *   �ǂݍ��ރ��W���[����.
 *   <�T�N���G�f�B�^�}�N���f�B���N�g��>/modules����̑��΃p�X���w�肷��B
 *   <�T�N���G�f�B�^�}�N���f�B���N�g��>/modules����̃f�B���N�g���ɂ���
 *   ���W���[����ǂݍ��ނ��Ƃ͏o���Ȃ��B
 * 
 * DirectoryClimbingModulePathError
 *   <�T�N���G�f�B�^�}�N���f�B���N�g��>/modules����̃f�B���N�g����
 *   ���W���[�����w�肵���ꍇ�ɔ�������B
 * 
 * usage:
 *   load("hoge.js"); // <sakura-macro-dir>/modules/hoge.js��ǂݍ��ݎ��s����
 */
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
	
	// TODO �����ɃR�[�h�������B
	load('hello_module.js');
	
	printHello();
	p([1, 2, 3, 4, 5].sum());
})();
