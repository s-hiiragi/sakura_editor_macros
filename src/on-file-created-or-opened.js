/**
 * @file  ファイル新規作成orオープン時にon-file-created/openedフォルダ以下のマクロを実行
 */

var __fso = new ActiveXObject('Scripting.FileSystemObject');
var __wsh = new ActiveXObject('WScript.Shell');


/* 外部のサクラエディタマクロファイル(モジュール)を読み込む
 *
 * 引数
 * __relativeModulePath
 *     Macroディレクトリ(※)をルートとする、モジュールファイルの相対パス
 *     ※ 共通設定＞マクロで設定するディレクトリ
 *
 * 戻り値
 *     読み込んだモジュールの末尾にある式文の値を返す
 */
function load(__relativeModulePath) {
    var arguments = void 0;
    try {
        return eval(function(){
            var fso = typeof __fso !== 'undefined' ? __fso : new ActiveXObject('Scripting.FileSystemObject');
            var wsh = typeof __wsh !== 'undefined' ? __wsh : new ActiveXObject('WScript.Shell');

            var macroDir = fso.GetParentFolderName(Editor.ExpandParameter('$M'));
            var absoluteModulePath = fso.BuildPath(macroDir, __relativeModulePath);

            var moduleDir = fso.GetParentFolderName(absoluteModulePath);
            wsh.CurrentDirectory = moduleDir;

            var f = null;
            try {
                f = fso.OpenTextFile(absoluteModulePath);
            } catch (e) {
                Editor.TraceOut('[E] The module could not be opened (' + absoluteModulePath + '): ' + e.message);
                throw e;
            }
            var code = f.AtEndOfStream ? '' : f.ReadAll();
            f.close();

            return code;
        }());
    } catch (e) {
        Editor.TraceOut('[E] An error occured in the module (' + __relativeModulePath + '): ' + e.message);
        throw e;
    }
}


(function(){
    var fso = __fso;
    var wsh = __wsh;

    function loadModules(dirPath) {
        var macroDir = fso.GetParentFolderName(Editor.ExpandParameter('$M'));
        var dir = fso.GetFolder(fso.BuildPath(macroDir, dirPath));

        var e = new Enumerator(dir.Files);
        for (; !e.atEnd(); e.moveNext()) {
            if (/\.js$/i.test(e.item().Name)) {
                var relativeModulePath = fso.BuildPath(dirPath, e.item().Name);
                load(relativeModulePath);
            }
        }
    }

    if (Editor.GetFilename() == '') {
        loadModules('on-file-created');
    } else {
        loadModules('on-file-opened');
    }
})();
