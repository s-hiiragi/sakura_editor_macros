/**
 * @file     選択中の変数名をアウトプットへ出力するマクロに展開
 * @version  1.0
 */

(function(){
	var inputStr;

	if (Editor.IsTextSelected() == 0) {
		inputStr = Editor.InputBox('変数名', '');
		if (!inputStr) return;
	} else {
		inputStr = Editor.GetSelectedString(0);
	}

	var code = "Editor.TraceOut('{1}: ' + {1});".replace(/\{1\}/g, inputStr);

	Editor.InsText(code);
})();
