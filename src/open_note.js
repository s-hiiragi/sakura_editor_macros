/**
 * @file ノートを開く
 *
 * 事前準備
 *
 * - 環境変数`SAKURA_NOTEPATH`に、ノート(.mdファイル)が格納されたフォルダのパスを設定する
 *
 * 各ノートの先頭付近にエイリアス名を書くことで、ノートをエイリアス名で開くことができる
 * 
 * エイリアスの設定方法 (省略可)
 * 
 * - 各ノートの先頭付近に`alias: エイリアス名1, エイリアス名2, …`と書く
 * - open_note_update_aliases.jsを実行する
 *
 * 推奨ショートカットキー: Alt+N
 */

/*
 * TODO ファイル名に使えない文字を全角に変換したい
 */

var fso = new ActiveXObject('Scripting.FileSystemObject');
var wsh = new ActiveXObject('WScript.Shell');

function trimExtension(path) {
    return path.replace(/\.[^\.]+$/, '');
}

function hasExtension(path) {
    return /\.[^.]+$/.test(path);
}

// @return {[string]: string}
function readAliases(filepath) {
    var aliases = {};

    if (fso.FileExists(filepath)) {
        var file = fso.OpenTextFile(filepath, 1, false, -1);  // Unicode
        var lines = file.ReadAll().split(/\r?\n/);
        file.Close();

        var reading = false;
        for (var i = 0; i < lines.length; i++) {
            if (reading) {
                if (lines[i].charAt(0) === '[') {
                    break;
                }
                var pair = lines[i].split(/\s*=\s*/);
                var key = pair[0];
                var val = pair[1];
                if (key && val) {
                    aliases[key] = val;
                }
            }
            else {
                if (lines[i] === '[aliases]') {
                    reading = true;
                }
            }
        }
    }

    return aliases;
}

// @return {Path: string, Name: string}[]
function getFiles(folderPath) {
    var files = [];

    var dir = fso.GetFolder(folderPath);

    for (var e = new Enumerator(dir.Files); !e.atEnd(); e.moveNext()) {
        var f = e.item();
        files.push(f);
    }

    return files;
}

(function(){

    // ノートのあるディレクトリのパスを取得

    var noteDirPath = wsh.ExpandEnvironmentStrings('%SAKURA_NOTEPATH%');

	if (noteDirPath.charAt(0) === '%') {
		WarnMsg('環境変数 SAKURA_NOTEPATH を設定してください。');
		return;
	}

	// 設定ファイルからノートの別名を読み込む

    var macroDir = fso.GetParentFolderName(Editor.ExpandParameter('$M'));
    var settingsFilePath = fso.BuildPath(macroDir, 'settings\\open_note.ini');
    var aliases = readAliases(settingsFilePath);

    // 開くor作成するノート名を入力

    var noteName = Editor.InputBox('ノート名', '', 100);
    if (!noteName) return;

    // エイリアス名があれば置換する

    if (aliases[noteName.toLowerCase()]) {
        noteName = aliases[noteName.toLowerCase()];
    }

    // ノートファイル一覧を取得

    var files = getFiles(noteDirPath);

    // 入力したノート名に一致するノートファイルを探す

    var notePath = null;

    // 1. 完全一致を試す
    // ただし、利便性のために、
    // - 大文字/小文字は区別しない
    // - 拡張子なしで比較する
    for (var i = 0; i < files.length; i++) {
        var f = files[i];
        if (noteName.toLowerCase() === trimExtension(f.Name.toLowerCase())) {
            notePath = f.Path;
            break;
        }
    }
    if (!notePath) {
        // 2. 部分一致を試す
        // ただし、
        // - 拡張子を指定されている場合は試さない
        if (!hasExtension(noteName)) {
            for (var i = 0; i < files.length; i++) {
                var f = files[i];
                if (f.Name.toLowerCase().indexOf(noteName.toLowerCase()) >= 0) {
                    notePath = f.Path;
                    break;
                }
            }
        }
    }

    // ノートを開く

    if (notePath) {
        Editor.FileOpen(notePath);
    } else {
        if (!hasExtension(noteName)) {
            noteName += '.md';
        }
        var notePath = fso.BuildPath(noteDirPath, noteName);
        Editor.FileOpen(notePath, 4/*UTF-8*/);
    }

})();
