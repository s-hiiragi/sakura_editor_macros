/**
 * @file ノートを開く
 *
 * 事前準備
 *
 * - 環境変数`SAKURA_NOTEPATH`に、ノート(.mdファイル)が格納されたフォルダのパスを設定する
 *
 * 推奨ショートカットキー: Alt+N
 */

/*
 * TODO ノートを別名で開きたい
 * TODO ファイル名に使えない文字を全角に変換したい
 */

function trimExtension(path) {
    return path.replace(/\.[^\.]+$/, '');
}

function hasExtension(path) {
    return /\.[^.]+$/.test(path);
}

(function(){

    var wsh = new ActiveXObject('WScript.Shell');
    var noteDirPath = wsh.ExpandEnvironmentStrings('%SAKURA_NOTEPATH%');

	if (noteDirPath.charAt(0) === '%') {
		WarnMsg('環境変数 SAKURA_NOTEPATH を設定してください。');
		return;
	}

    var noteName = Editor.InputBox('ノート名', '', 100);
    if (!noteName) return;

    var files = [];
    var fso = new ActiveXObject('Scripting.FileSystemObject');

    var noteDir = fso.GetFolder(noteDirPath);
    for (var e = new Enumerator(noteDir.Files); !e.atEnd(); e.moveNext()) {
        var f = e.item();
        files.push(f);
    }

    var notePath = null;

    // 完全一致を試す
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
        // 部分一致を試す
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
