/**
 * @file ノートのエイリアス設定を更新する
 *
 * 事前準備
 *
 * - 環境変数`SAKURA_NOTEPATH`に、ノート(.mdファイル)が格納されたフォルダのパスを設定する
 *
 * 推奨ショートカットキー: Alt+N
 */

var fso = new ActiveXObject('Scripting.FileSystemObject');
var wsh = new ActiveXObject('WScript.Shell');

function trimExtension(filepath) {
    return filepath.replace(/\.[^.]+$/, '');
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

// @return string[]
function readAliasesFromNote(notePath) {
    var aliases = [];

    var stream = new ActiveXObject('ADODB.Stream');
    stream.Charset = 'UTF-8';
    stream.Open();
    stream.LoadFromFile(notePath);
    
    for (var i = 0; i < 10; i++) {
        if (stream.EOS) {
            break;
        }
        var line = stream.ReadText(-2).replace(/\r?\n$/, '');  // adReadLine
        if (/^alias:/.test(line)) {
            aliases = line.replace(/^alias:\s*/, '').split(/\s*,\s*/);
            break;
        }
    }
    stream.Close();
    
    return aliases;
}

function writeAliases(settingFile, noteByAlias) {
    var file = fso.OpenTextFile(settingFile, 2, true, -1);  // Unicode

    file.WriteLine('[aliases]');

    for (var alias in noteByAlias) {
        file.WriteLine(alias + '=' + noteByAlias[alias]);
    }

    file.Close();
}

(function(){

    // ノートのあるディレクトリのパスを取得

    var noteDirPath = wsh.ExpandEnvironmentStrings('%SAKURA_NOTEPATH%');

	if (noteDirPath.charAt(0) === '%') {
		WarnMsg('環境変数 SAKURA_NOTEPATH を設定してください。');
		return;
	}

    // ノートファイル一覧を取得

    var files = getFiles(noteDirPath);

    // 各ノートからエイリアスを読みだす
    
    var noteNameByAlias = {};
    
    for (var i = 0; i < files.length; i++) {
        var f = files[i];
        var name = trimExtension(f.Name.toLowerCase());
        var aliases = readAliasesFromNote(f.Path);

        for (var k = 0; k < aliases.length; k++) {
            var alias = aliases[k].toLowerCase();
            noteNameByAlias[alias] = name;
        }
    }

	// 設定ファイルにノートの別名を書き込む

    var macroDir = fso.GetParentFolderName(Editor.ExpandParameter('$M'));
    var settingsFilePath = fso.BuildPath(macroDir, 'settings\\open_note.ini');
    writeAliases(settingsFilePath, noteNameByAlias);

    Editor.InfoMsg('更新完了');

})();
