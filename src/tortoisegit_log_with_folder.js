/**
 * @file  フォルダを指定してTortoiseGitのログ画面を開く
 */
(function(){
	var docPath = Editor.GetFilename();
	if (!docPath) return;

	var fso = new ActiveXObject('Scripting.FileSystemObject');
	var docFolderPath = fso.GetParentFolderName(docPath);
	
	var tortoiseGitProcPath = "C:\\Program Files\\TortoiseGit\\bin\\TortoiseGitProc.exe";
	if (!fso.FileExists(tortoiseGitProcPath)) {
		Editor.ErrorMsg(tortoiseGitProcPath + 'が見つかりません');
		return;
	}
	
	var command = '"' + tortoiseGitProcPath + '"'
		+ ' /command:log'
		+ ' /path:"' + docFolderPath + '"';

//	Editor.TraceOut('command=' + command);

	var sh = new ActiveXObject('WScript.Shell');
	sh.Run(command);
})();
