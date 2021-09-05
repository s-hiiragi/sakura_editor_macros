/**
 * @file    �T�N���G�f�B�^�}�N��API�̃��b�p�[
 * @author  s_hiiragi (https://github.com/s-hiiragi)
 */

// �W���o��
(function() {
	var printbuf = [];
	
	/**
	 * print(message)
	 * �A�E�g�v�b�g�ɕ�������o�͂���.
	 * 
	 * ��) print()�̏o�͂�println()��flush()���ĂԂ܂Ńo�b�t�@�����O����邱�Ƃ�
	 *     ����.
	 * 
	 * message : any
	 *   �o�͂��镶����
	 * 
	 * usage:
	 *   print("hoge");
	 */
	exports.print = function print(message) {
		printbuf.push(String(message));
	};
	
	/**
	 * println(message)
	 * �A�E�g�v�b�g�ɕ������1�s�o�͂���.
	 * 
	 * message : any
	 *   �o�͂��镶����
	 * 
	 * usage:
	 *   println("hoge");
	 */
	exports.println = function println(message) {
		if (arguments.length == 0) message = '';
		
		// true, false��"true", "false"�Əo�͂��邽�߂�String(msg)�͕K�v
		Editor.TraceOut(printbuf.join('') + String(message));
		printbuf = [];
	};
	
	/**
	 * flush()
	 * print()�Ńo�b�t�@�����O���ꂽ��������A�E�g�v�b�g�E�B���h�E�ɏo�͂���.
	 */
	exports.flush = function flush() {
		println();
	};
	
	/**
	 * p(message)
	 * println(message)�̓��ߍ\��
	 */
	exports.p = println;
	
	
	/**
	 * prompt(message[, defaultValue]) => string or null
	 * �e�L�X�g���̓{�b�N�X��\�������͕�������擾����
	 * 
	 * message : string
	 *   �����Ƃ��ĕ\�����镶����
	 * defaultValue : any
	 *   ���̓t�B�[���h�̏����l
	 * 
	 * �߂�l
	 *   [OK]�{�^���������ꂽ�ꍇ�͓��͕����񂪕Ԃ����
	 *   [�L�����Z��]�{�^���������ꂽ�ꍇ��null���Ԃ����
	 * 
	 * �Q�l
	 * http://www.geocities.jp/maru3128/SakuraMacro/usage/scriptcontrol.html
	 */
	exports.prompt = function(message, defaultValue) {
		message = '' + message;
		if (arguments.length < 2) defaultValue = '';
		
		var sc = new ActiveXObject('ScriptControl');
		sc.Language = 'VBScript';
		var code = 
				  'Function InputBox2(prompt, title, default)\n'
				+ '  InputBox2 = InputBox(prompt, title, default)\n'
				+ 'End Function\n';
		sc.AddCode(code);
		var ret = sc.Run('InputBox2', message, 'SakuraEditorMacro', defaultValue);
		return (typeof ret === 'string' ? ret : null);
	};
	
	
	var clipboard = {};
	
	/**
	 * clipboard.getText() => string
	 * �N���b�v�{�[�h����e�L�X�g���擾����
	 * 
	 * �߂�l
	 *   �N���b�v�{�[�h�ɓ����Ă��镶����
	 * 
	 * �Q�l
	 * http://www.geocities.jp/maru3128/SakuraMacro/usage/clipmacro.html
	 */
	clipboard.getText = function() {
		var ie = new ActiveXObject('InternetExplorer.Application');
		ie.Navigate('about:blank');
		var ret = ie.Document.parentWindow.clipboardData.getData('Text');
		return ret;
	};
	
	exports.clipboard = {};
})();


// console API
(function() {
	var console = {};
	
	console.log = function() {
		var args = Array.prototype.slice.call(arguments);
		println(args.join(' '));
	};
	console.debug = function() {
		if (!debug) return;
		var args = Array.prototype.slice.call(arguments);
		args.unshift('[debug]');
		console.log.apply(console, arguments);
	};
	console.warn = function() {
		var args = Array.prototype.slice.call(arguments);
		args.unshift('[warning]');
		console.log.apply(console, arguments);
	};
	console.error = function() {
		var args = Array.prototype.slice.call(arguments);
		args.unshift('[error]');
		console.log.apply(console, arguments);
	};
	
	exports.console = console;
})();


// �T�N���G�f�B�^�}�N��API
(function() {
	var editor = {};
	
	editor.insert   = function(msg) { Editor.InsText(msg); };
	editor.insertln = function(msg) { Editor.InsText(msg + doc.newline); };
	
	editor.undo = function() { Editor.Undo(); };
	editor.canUndo = function() { return !!Editor.IsPossibleUndo(); };
	editor.redo = function() { Editor.Redo(); };
	editor.canRedo = function() { return !!Editor.IsPossibleRedo(); };
	
	
	editor.tagjump = {};
	editor.tagjump.next = function() {};
	editor.tagjump.prev = function() {};
	
	editor.diff = {};
	editor.diff.next = function() {};
	editor.diff.prev = function() {};
	
	editor.bookmark = {};
	editor.bookmark.next = function() {};
	editor.bookmark.prev = function() {};
	
	
	// GUI
	editor.funckey = {};
	editor.funckey.toggle = function() { Editor.ShowFunckey(); };
	
	editor.statusbar = {};
	editor.statusbar.toggle = function() { Editor.ShowStatusbar(); };
	
	editor.tabbar = {};
	editor.tabbar.toggle = function() { Editor.ShowTab(); };
	
	editor.toolbar = {};
	editor.toolbar.toggle = function() { Editor.ShowToolbar(); };
	
	editor.window = {};
	editor.window.next = function() { Editor.NextWindow(); };
	editor.window.prev = function() { Editor.PrevWindow(); };
	
	
	// �_�C�A���O
	editor.commonOptionDialog = {};
	editor.commonOptionDialog.showModal = function() { Editor.OptionCommon(); };
	
	editor.typeListDialog = {};
	editor.typeListDialog.showModal = function() { Editor.TypeList(); };
	
	editor.typeOptionDialog = {};
	editor.typeOptionDialog.showModal = function() { Editor.OptionType(); };
	
	editor.fontDialog = {};
	editor.fontDialog.showModal = function() { Editor.SelectFont(); };
	
	
	exports.editor = editor;
})();


// �h�L�������g�ŗL�̏��
(function() {
	var doc = {};
	
	doc.newline = ['\r\n', '\r', '\n'][Editor.GetLineCode()];
	
	exports.doc = doc;
})();
