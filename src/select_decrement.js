eval(function(){
	var fso = new ActiveXObject('Scripting.FileSystemObject');
	var src = fso.OpenTextFile('lib/rotateSelectedText.js').ReadAll();
	return src;
}());

rotateSelectedText(-1);
