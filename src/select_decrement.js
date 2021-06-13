eval(function(){
	var fso = new ActiveXObject('Scripting.FileSystemObject');
	var src = fso.OpenTextFile('modules/rotateSelectedText.js').ReadAll();
	return src;
}());

rotateSelectedText(-1);
