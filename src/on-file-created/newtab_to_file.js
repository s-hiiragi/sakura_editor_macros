/*
 * 無題タブを一時ファイルに保存する
 *
 * ファイルとして保存することで、
 * - 自動保存される (共通設定＞ファイルで「自動的に保存する」にチェックを入れている場合)
 * - クラッシュ時に編集内容が残る
 */

(function(){

	var fso = new ActiveXObject('Scripting.FileSystemObject');

	var newTabDir = '.newtab_cache';
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
