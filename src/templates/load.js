function load(relativeModulePath) {
	var fso = new ActiveXObject('Scripting.FileSystemObject');
	var macroDir = fso.GetParentFolderName(Editor.ExpandParameter('$M');
	var absoluteModulePath = fso.BuildPath(macroDir, relativeModulePath);
	var code = fso.OpenTextFile(absoluteModulePath).ReadAll();
	eval(code);
}
