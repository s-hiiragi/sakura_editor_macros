// utilities
var p = function(s) { Editor.TraceOut(s); };
var i = function(s) { Editor.InsText(s); };
var s = Editor.GetSelectedString(0);

var result = eval(Editor.GetClipboard(0));
if (typeof result !== 'undefined') {
	Editor.TraceOut(result);
}
