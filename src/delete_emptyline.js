/**
 * @file     空行の削除
 * @version  1.0
 */

Editor.SelectAll();

var allText = Editor.GetSelectedString(0);

var newlineStr = ['\r\n', '\r', '\n'][Editor.GetLineCode()];
var newlinePat = ['\\r\\n', '\\r', '\\n'][Editor.GetLineCode()];

var regNewlinePrefix = new RegExp('^' + newlinePat);
var regNewlines = new RegExp('(?:' + newlinePat + '){2,}', 'g');

allText = allText
	.replace(regNewlines, newlineStr)
	.replace(regNewlinePrefix, '');

Editor.InsText(allText);
