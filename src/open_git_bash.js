/**
 * @file  Git bash‚ðŠJ‚­
 */
(function(){
	var docPath = Editor.GetFilename();
	if (!docPath) return;

	var fso = new ActiveXObject('Scripting.FileSystemObject');
	var docFolderPath = fso.GetParentFolderName(docPath);

	var wscriptPath = 'C:\\Windows\\SysWOW64\\wscript.exe';
	if (!fso.FileExists(wscriptPath)) {
		Editor.ErrorMsg(wscriptPath + '‚ªŒ©‚Â‚©‚è‚Ü‚¹‚ñ');
		return;
	}

	var gitBashPath = 'C:\\Program Files (x86)\\Git\\Git Bash.vbs';
	if (!fso.FileExists(gitBashPath)) {
		Editor.ErrorMsg(gitBashPath + '‚ªŒ©‚Â‚©‚è‚Ü‚¹‚ñ');
		return;
	}

	var command = '"' + wscriptPath + '"'
		+ ' "' + gitBashPath + '"'
		+ ' "' + docFolderPath + '"';

//	Editor.TraceOut('command=' + command);

	var sh = new ActiveXObject('WScript.Shell');
	sh.Run(command);
})();
