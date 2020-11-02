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
