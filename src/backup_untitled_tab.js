/**
 * @file     �T�N���G�f�B�^�̐V�K�^�u���e�̃o�b�N�A�b�v���x������
 * @author   s_hiiragi <https://github.com/s-hiiragi>
 * @version  2.0
 *
 * @description
 * <p>
 *   �T�N���G�f�B�^�ɂ̓t�@�C���̎����ۑ��@�\�����邽�߁A�\������Windows�̏I��
 *   �ɑ΂��ėL���ł��B�������A�V�K�쐬�����(����)�^�u�̓t�@�C���Ƃ��ĕۑ�����
 *   �Ă��Ȃ����߁A�����ۑ��@�\�ŕۑ����ꂸ�\������Windows�̏I���ɂ���ē��e��
 *   �i�v�Ɏ����܂��B
 * </p><p>
 *   ���̖����������邽�߂ɁA���̃}�N���͐V�K�쐬�����(����)�^�u�̓��e����
 *   ���t�@�C���ɕۑ����܂��B
 * </p><p>
 *   �}�N���̓o�^���@
 *   <ol>
 *     <li>���j���[��[�ݒ�]-[���ʐݒ�]���J���܂��B</li>
 *     <li>�}�N���^�u��I�����܂��B</li>
 *     <li>�{�t�@�C����u�����t�H���_�̃p�X���}�N���ꗗ�̉��̃e�L�X�g�{�b�N�X�ɓ��͂��܂��B</li>
 *     <li>�Q�ƃ{�^���������ăt�H���_��I�����Ă��\���܂���B</li>
 *     <li>���X�g����󂢂Ă���ԍ��̍s���N���b�N���đI�����܂��B</li>
 *     <li>���̕��̖��O�Ɂu���l�[���v���AFile�Ɂubackup_untitled_tab.js�v����͂��܂��B</li>
 *     <li>�������s:�̉��́u�V�K�^�J�t�@�C����v�Ƀ`�F�b�N�����܂��B</li>
 *     <li>�ݒ�{�^���������܂��B</li>
 *     <li>OK�{�^���������ă_�C�A���O����܂��B</li>
 *   </ol>
 * </p><p>
 *   �T�N���G�f�B�^�̕K�v�o�[�W����: 2.0.0.2 �ȏ�
 * </p>
 */

/*
 * �X�V����
 *   version 2.0
 *     "sakura.exe.ini"�Ŏw�肳�ꂽ���[�U�[�t�H���_�Ɉꎞ�t�@�C����ۑ�����悤
 *     �ɕύX
 *   version 1.0
 *     ����
 */
(function () {
	var UNTITLED_DIR_NAME = 'untitled_files';
	var UNTITLED_PARENT_DIR = null;  // �f�t�H���g = "sakura.exe"�̑��݂���f�B���N�g��
	var UNTITLED_FILE_PREFIX = '����_';
	
	var DEFAULT_CHARSET = 4;  // UTF-8
	var DEFAULT_NEWLINE = 1;  // CRLF
	
	var fso = new ActiveXObject('Scripting.FileSystemObject');
	var wsh_shell = new ActiveXObject('WScript.SHell');
	
	
	// ����^�u���ǂ����`�F�b�N
	if (Editor.GetFilename() != '') return;
	
	var untitled_dir = UNTITLED_PARENT_DIR || fso.buildPath(get_user_dir(), UNTITLED_DIR_NAME);
	
	var save_index = -1;
	if (fso.folderExists(untitled_dir)) {
		// �Ⴂ�Y�������珇�Ƀt�@�C���I�[�v���\�����ׁA�t�@�C�������݂��Ȃ�
		// or���b�N����ĂȂ��Y�������擾
		
		for (var i=0; i < 64; ++i) {  // �\���h�~�̂��߁A�����Đ������ۂ��Ă���
			var save_path = fso.buildPath(untitled_dir, UNTITLED_FILE_PREFIX + i);
			
			if (!fso.fileExists(save_path)) {
				save_index = i;
				break;
			}
			try {
				var f = fso.openTextFile(save_path, 2);
				f.close();
				
				save_index = i;
				break;
			}
			catch (e) {
				// �t�@�C���������݃��[�h�ŊJ���Ȃ� = �ҏW���Ɣ��f���A���̓Y����
				// �t�@�C���I�[�v��������
			}
		}
		if (save_index == -1) {
			wsh_shell.popup(
				'����t�@�C�����̐����ɒB�������ߕۑ��ł��܂���ł���', 0, 
				'�T�N���G�f�B�^�}�N�� - '
					+ fso.getFileName(Editor.ExpandParameter('$M')), 0 + 48);
			return;
		}
	}
	else {
		fso.createFolder(untitled_dir);
		save_index = 0;  // ����t�@�C�������݂��Ȃ����Ƃ͕������Ă���̂�0�Ԗ�
	}
	
	// ����t�@�C����ۑ�
	var save_path = fso.buildPath(untitled_dir, UNTITLED_FILE_PREFIX + save_index);
	Editor.FileSaveAs(save_path, DEFAULT_CHARSET, DEFAULT_NEWLINE);
	
	
	function get_user_dir() {
		var sakura_path = Editor.ExpandParameter('$S');
		var sakura_dir = fso.getParentFolderName(sakura_path);
		var sakura_ini = sakura_path + '.ini';
		
		var ret = sakura_dir;
		if (fso.fileExists(sakura_ini)) {
			var ini = read_ini(sakura_ini);
			
			if (ini.Settings.MultiUser == 1) {
				var base_dir = null;
				
				switch (Number(ini.Settings.UserRootFolder)) {
				case 0: /* shell:AppData  */ base_dir = wsh_shell.expandEnvironmentStrings('%AppData%'); break;
				case 1: /* shell:Profile  */ base_dir = wsh_shell.expandEnvironmentStrings('%UserProfile%'); break;
				case 2: /* shell:Personal */ base_dir = wsh_shell.specialFolders('MyDocuments'); break;
				case 3: /* shell:Desktop  */ base_dir = wsh_shell.specialFolders('Desktop'); break;
				default:
					throw new Error('Unreachable Error: UserRootFolder = ' + ini.Settings.UserRootFolder);
				}
				ret = fso.buildPath(base_dir, ini.Settings.UserSubFolder);
			}
		}
		return ret;
	}
	
	function read_ini(filename) {
		var f = fso.openTextFile(filename);
		var lines = f.readAll().split(/\r\n?|\n/);
		f.close();
		
		// for parsing
		var re_sect = new RegExp();
		re_sect.compile('^\\[([^\\]]+)\\]$');
		var re_kv = new RegExp();
		re_kv.compile('^([^=]+)\\s*=\\s*(.*)$');
		
		var ret = {}, sect = '';
		for (var i = 0, l = lines.length; i < l; ++i) {
			var line = lines[i].replace(/^\s+|\s+$/g, '');
			
			if (line === '' || line.charAt(0) === ';')  // empty line | linear comment
				continue;
			
			if (re_sect.test(line)) {  // [ section ]
				sect = re_sect.exec(line)[1];
				ret[sect] = {};
			}
			else if (re_kv.test(line)) {  // key = value
				var m = re_kv.exec(line), 
					key = m[1], val = m[2];
				(sect ? ret[sect] : ret)[key] = val;
			}
			else {  // unknown format
				throw new Error('IniParseError: at line ' + i + ', "' + line.replace(/\"/g, '\\"') + '"');  // "
			}
		}
		
		return ret;
	}
	
})();
