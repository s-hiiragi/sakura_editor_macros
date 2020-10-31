/**
 * あああ
 */

(function(){

	var fso = new ActiveXObject('Scripting.FileSystemObject');

	var newTabDir = 'C:\\Users\\hii\\managed\\data\\src\\sakura_editor_macros\\src\\on-file-created\\.newtab_cache';
	if (!fso.FolderExists(newTabDir)) {
		fso.CreateFolder(newTabDir);
	}

	var newTabFile;
	for (var i = 0; i < 32; i++) {
		var path = fso.BuildPath(newTabDir, '無題_' + (i+1));
		if (!fso.FileExists(path)) {
			newTabFile = path;
			break;
		} else {
			var f;
			try {
				f = fso.OpenTextFile(path, 2/*ForWriting*/);
				// 開ける=エディタでは開いていない
				f.Close();
				newTabFile = path;
				break;
			} catch (e) {
				// 開けない=エディタで開いている
				if (f) f.Close();
			}
		}
	}
	if (newTabFile) {
		Editor.FileSaveAs(newTabFile, 4/*UTF-8*/, 1/*CRLF*/);
	}

})();
