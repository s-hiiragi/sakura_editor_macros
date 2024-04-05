/**
 * @file  ファイル新規作成orオープン時にon-file-created/openedフォルダ以下のマクロを実行
 */

var __fso = new ActiveXObject('Scripting.FileSystemObject');
var __wsh = new ActiveXObject('WScript.Shell');
var macroDir = __fso.GetParentFolderName(Editor.ExpandParameter('$M'));

/**
 * 外部のサクラエディタマクロファイル(モジュール)を読み込む
 *
 * @param {string}  __relativeModulePath - マクロフォルダ(※)からのモジュールファイルの相対パス。
 *                                         ※ 共通設定＞マクロで設定するフォルダ。
 *
 * @returns {?}  読み込んだモジュールの末尾にある式文の値
 */
function load(__relativeModulePath) {
    var arguments = void 0;
    try {
        return eval(function(){
            var modulePath = __fso.BuildPath(macroDir, __relativeModulePath);
            var moduleDir = __fso.GetParentFolderName(modulePath);
            __wsh.CurrentDirectory = moduleDir;

            var code = '';
            try {
                var f = __fso.OpenTextFile(modulePath);
                code = f.AtEndOfStream ? '' : f.ReadAll();
                f.Close();
            } catch (e) {
                Editor.TraceOut('ERROR: The module could not be opened (' + modulePath + '): ' + e.message);
                throw e;
            }
            return code;
        }());
    } catch (e) {
        Editor.TraceOut('ERROR: An error occured in the module (' + __relativeModulePath + '): ' + e.message);
        throw e;
    }
}

(function(){
    function loadModules(relativeModuleDirPath) {
        var dir = __fso.GetFolder(__fso.BuildPath(macroDir, relativeModuleDirPath));
        var e = new Enumerator(dir.Files);

        for (; !e.atEnd(); e.moveNext()) {
            var filename = e.item().Name;
            if (/\.js$/i.test(filename)) {
                var relativeModuleFilePath = __fso.BuildPath(relativeModuleDirPath, filename);
                load(relativeModuleFilePath);
            }
        }
    }

    if (Editor.GetFilename() === '') {
        loadModules('on-file-created');
    } else {
        loadModules('on-file-opened');
    }
})();
