/*
 * open_in_vscode.js
 * VS Codeで開く
 *
 * 問題: コマンドプロンプト ウィンドウが開いてしまう
 * 妥協策: コマンドプロンプト ウィンドウを非表示で起動させる (VS Codeが終了すればバックグラウンドのコマンドプロンプト ウィンドウも閉じる)
 */

// files[i]をファイルとみなすか、フォルダとみなすかについて
//
// files[i]が`/`または`\\`で終わる文字列の場合、フォルダ名として扱う
// それ以外の場合、ファイル名として扱う
function someFileExistsInFolder(folder, files) {
    var fso = new ActiveXObject('Scripting.FileSystemObject');

    for (var i = 0; i < files.length; i++) {
        if (/[\/\\]$/.test(files[i])) {  // folder
            var subFolder = files[i].replace(/[\/\\]$/, '');
            var path = fso.BuildPath(folder, subFolder);
            if (fso.FolderExists(path)) {
                return files[i];
            }
        }
        else {  // file
            var path = fso.BuildPath(folder, files[i]);
            if (fso.FileExists(path)) {
                return files[i];
            }
        }
    }
    return '';
}

function findWorkspacePath(beginFolderPath) {
    var fso = new ActiveXObject('Scripting.FileSystemObject');

    var markerFiles = [  // 期待度順に並べる
        '.git/',
        '.vscode/',
        'README.md',
        'package.json',
        'tsconfig.json',
        'node_modules/',
        '.venv/',
        'venv/',
        '.sln',
        '.git'
    ];

    var folder = beginFolderPath;
    for (var i = 0; i < 256 && folder; i++) {  // 安全策
        // ワークスペースの目印となるファイルを探す
        if (someFileExistsInFolder(folder, markerFiles)) {
            return folder;
        }
        folder = fso.GetParentFolderName(folder);
    }
    return '';
}

(function(){
    var fso = new ActiveXObject('Scripting.FileSystemObject');

    var filename = Editor.GetFilename();
    var parentFolder = fso.GetParentFolderName(filename);
    var lineNumber = Editor.ExpandParameter('$y');

    var workspacePath = findWorkspacePath(parentFolder);
    if (!workspacePath) {
        workspacePath = parentFolder;
    }

    var codePath = 'C:\\Program Files\\Microsoft VS Code\\bin\\code.cmd';
    if (!fso.FileExists(codePath)) {
        var wshShell = new ActiveXObject('WScript.Shell');
        var localAppData = wshShell.expandEnvironmentStrings('%LocalAppData%');
        var codePath2 = localAppData + '\\Programs\\Microsoft VS Code\\bin\\code.cmd';
        if (!fso.FileExists(codePath)) {
            Editor.ErrorMsg('VSCodeが見つかりません。\r\n探索した場所:\r\n' + codePath + '\r\n' + codePath2);
            return;
        }
        codePath = codePath2;
    }

    var commandLine = '"' + codePath + '" "' + workspacePath + '" --goto "' + filename + ':' + lineNumber + '"';

    /*
    // XXX 以下で起動できない理由が分からない。
    var commandLine = 'cmd.exe /C "start """" ""' + codePath + '"" ""' + workspacePath + '"" --goto ""' + filename + ':' + lineNumber + '"" "';
    // 'C:\Program' が見つかりません。エラーが出る
    traceout = commandLine;
    */

    var wshShell = new ActiveXObject('WScript.Shell');
    wshShell.Run(commandLine, 0, false);

    Editor.ExecCommand(commandLine, 0);
})();
