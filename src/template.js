/**
 * @name         template.js
 * @description  サクラエディタマクロのテンプレート
 * @author       s_hiiragi (https://github.com/s-hiiragi)
 * @updated      2013/10/13 04:44:01 JST
 */

// [[Global]].xxx(Editor.xxx)と同名のオブジェクトを外部公開すると
// [[Global]].xxxが呼ばれてしまう問題があるため、以下のように予めローカル変数を
// 定義することで回避する。
// (何故か[[Global]].xxx(Editor.xxx)に値を代入すると関数呼び出ししてしまう)
// 
var print; // [[Global]].Print(Editor.Print)と"common.js"のprint()の衝突を回避

/**
 * load(rel_module_path)
 * サクラエディタマクロモジュールファイルを読み込み実行する.
 * 
 * rel_module_path : string
 *   読み込むモジュール名.
 *   <サクラエディタマクロディレクトリ>/modulesからの相対パスを指定する。
 *   <サクラエディタマクロディレクトリ>/modulesより上のディレクトリにある
 *   モジュールを読み込むことは出来ない。
 * 
 * DirectoryClimbingModulePathError
 *   <サクラエディタマクロディレクトリ>/modulesより上のディレクトリの
 *   モジュールを指定した場合に発生する。
 * 
 * usage:
 *   load("hoge.js"); // <sakura-macro-dir>/modules/hoge.jsを読み込み実行する
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
	
	// TODO ここにコードを書く。
	load('hello_module.js');
	
	printHello();
	p([1, 2, 3, 4, 5].sum());
})();
