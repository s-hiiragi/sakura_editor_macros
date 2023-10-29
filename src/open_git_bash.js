/**
 * @file  Git bashを開く
 */
(function(){
	var docPath = Editor.GetFilename();
	if (!docPath) return;

	var fso = new ActiveXObject('Scripting.FileSystemObject');
	var docFolderPath = fso.GetParentFolderName(docPath);

	var wscriptPath = 'C:\\Windows\\SysWOW64\\wscript.exe';
	if (!fso.FileExists(wscriptPath)) {
		Editor.ErrorMsg(wscriptPath + 'が見つかりません');
		return;
	}

	var gitBashPath = 'C:\\Program Files (x86)\\Git\\Git Bash.vbs';
	if (!fso.FileExists(gitBashPath)) {
		Editor.ErrorMsg(gitBashPath + 'が見つかりません');
		return;
	}

	var command = '"' + wscriptPath + '"'
		+ ' "' + gitBashPath + '"'
		+ ' "' + docFolderPath + '"';

//	Editor.TraceOut('command=' + command);

	var sh = new ActiveXObject('WScript.Shell');
	sh.Run(command);
})();
