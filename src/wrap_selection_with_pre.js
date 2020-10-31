/**
 * wrap selection with pre tag
 */

var seltext = Editor.GetSelectedString(0)
var newline = ['\r\n', '\r', '\n'][Editor.GetLineCode()]

if (seltext.slice(0, newline.length) != newline) {
	seltext = newline + seltext
}

if (seltext.substr(-newline.length, newline.length) != newline) {
	seltext += newline
	traceout = 1
}

Editor.InsText('<pre>' + seltext + '</pre>')
