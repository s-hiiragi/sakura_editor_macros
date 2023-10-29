/**
 * @file  選択テキストを次へ
 */

/* 使い方
 *   => modules/spin_seltext.js を参照。
 */

var print; // [[Global]].Print(Editor.Print)と"common.js"のprint()の衝突を回避

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
		
		// 読み込み済みモジュールの読み込みをスキップする
		var normalized_path = abs_module_path.substring(module_dir.length).replace(/^\\/, '');
		load._loaded || (load._loaded = {});
		if (load._loaded[normalized_path]) {
			return;
		}
		load._loaded[normalized_path] = true;
		return fso.OpenTextFile(abs_module_path).ReadAll();
	})();
	if (!__code) return;
	// モジュールから外部公開したオブジェクトはexportsに集められる
	var exports = {};
	try {
		with (exports) {
			eval(__code);
		}
	} catch (ex) {
		Editor.TraceOut(ex);
		throw ex;
	}
	// exportsに集められたオブジェクトをグローバル変数として公開する
	for (var k in exports) {
		if (k[0] != '_') { // '_'で始まる名前は外部公開をスキップする
			new Function('v', k + '=v')(exports[k]); // k=v を実行する(グローバル変数への書込み)
		}
	}
}

(function() {
	load('common.js');
	
	macro_args = { delta: 1 };
	load('spin_seltext.js');
})();
