/**
 * @name         <sakura-macro>/modules/commons/sakura.js
 * @description  サクラエディタマクロAPIのラッパー
 * @author       s_hiiragi (https://github.com/s-hiiragi)
 * @updated      2013/10/15 03:31:40 JST
 */

// 標準出力
(function() {
	var printbuf = [];
	
	/**
	 * print(message)
	 * アウトプットに文字列を出力する.
	 * 
	 * 註) print()の出力はprintln()かflush()を呼ぶまでバッファリングされることに
	 *     注意.
	 * 
	 * message : any
	 *   出力する文字列
	 * 
	 * usage:
	 *   print("hoge");
	 */
	exports.print = function print(message) {
		printbuf.push(String(message));
	};
	
	/**
	 * println(message)
	 * アウトプットに文字列を1行出力する.
	 * 
	 * message : any
	 *   出力する文字列
	 * 
	 * usage:
	 *   println("hoge");
	 */
	exports.println = function println(message) {
		if (arguments.length == 0) message = '';
		
		// true, falseを"true", "false"と出力するためにString(msg)は必要
		Editor.TraceOut(printbuf.join('') + String(message));
		printbuf = [];
	};
	
	/**
	 * flush()
	 * print()でバッファリングされた文字列をアウトプットウィンドウに出力する.
	 */
	exports.flush = function flush() {
		println();
	};
	
	/**
	 * p(message)
	 * println(message)の糖衣構文
	 */
	exports.p = println;
	
	
	/**
	 * prompt(message[, defaultValue]) => string or null
	 * テキスト入力ボックスを表示し入力文字列を取得する
	 * 
	 * message : string
	 *   説明として表示する文字列
	 * defaultValue : any
	 *   入力フィールドの初期値
	 * 
	 * 戻り値
	 *   [OK]ボタンが押された場合は入力文字列が返される
	 *   [キャンセル]ボタンが押された場合はnullが返される
	 * 
	 * 参考
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
	 * クリップボードからテキストを取得する
	 * 
	 * 戻り値
	 *   クリップボードに入っている文字列
	 * 
	 * 参考
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


// サクラエディタマクロAPI
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
	
	
	// ダイアログ
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


// ドキュメント固有の情報
(function() {
	var doc = {};
	
	doc.newline = ['\r\n', '\r', '\n'][Editor.GetLineCode()];
	
	exports.doc = doc;
})();
