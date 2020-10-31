/**
 * @file  ファイル新規作成orオープン時にon-file-created/openedフォルダ以下のマクロを実行
 */

// TODO 読み込んだモジュールからデータをエクスポートしたい
function load(relativeModulePath) {
	var fso = new ActiveXObject('Scripting.FileSystemObject');
	var macroDir = fso.GetParentFolderName(Editor.ExpandParameter('$M'));
	var absoluteModulePath = fso.GetAbsolutePathName(fso.BuildPath(macroDir, relativeModulePath));
	var textFile;
	try {
		textFile = fso.OpenTextFile(absoluteModulePath);
	} catch (e) {
		Editor.TraceOut('[E] load(): file open failed: ' + e.message + ': ' + absoluteModulePath);
		throw e;
	}
	var code = textFile.ReadAll();
	try {
		// グローバル変数は上書きできる
		eval(code);
	} catch (e) {
		Editor.TraceOut('[E] load(): eval() failed: ' + e.message + ': ' + absoluteModulePath);
		throw e;
	}
}

// ファイル保存後、も判定しようと思えばできそう (Cookieを使う)

// TODO ディレクトリ内の全*.jsを読み込む
if (Editor.GetFilename() == '') {
	//load('on-file-created/hello.js');
	load('on-file-created/newtab_to_file.js');
} else {
	//load('on-file-opened/hello.js');
}
