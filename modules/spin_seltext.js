/**
 * @name         spin_seltext.js
 * @description  選択テキストを次/前へ
 * @author       s_hiiragi (https://github.com/s-hiiragi)
 */

/* 概要
 * 
 * 選択テキストを次or前のテキストへ変更する。
 * 
 * 例1) 次へ進む例
 *   月→火, 火→水, …, 日→月 といったように変更される
 *   1→2, 2→3, …, 9→10 といったように変更される
 * 
 * 例2) 前へ進む例
 *   日→土, 土→金, …, 月→日 といったように変更される
 *   10→9, 9→8, …, 0→-1 といったように変更される
 */

/* 設定
 *   (1) 共通設定＞マクロを開き、以下の2つを登録する。
 *     名前: "選択テキストを次へ", File:"next_seltext.js"
 *     名前: "選択テキストを前へ", File:"prev_seltext.js"
 *   
 *   (2) 共通設定＞キー割り当てを開き、以下の2つのキー割り当てを変更する。
 *     Ctrl+Up    => 選択テキストを次へ
 *     Ctrl+Down  => 選択テキストを前へ
 * 
 * 使い方
 *   (1) 「月」と入力する。
 *   (2) 「月」を選択し、Ctrl+Up もしくは Ctrl+Down を押す。
 */

var lists = [
		{ pattern: /^[月火水木金土日]$/, list: ['月','火','水','木','金','土','日'] }, 
		{ pattern: /^[月火水木金土日]曜$/, list: ['月曜','火曜','水曜','木曜','金曜','土曜','日曜'] }, 
		{ pattern: /^[月火水木金土日]曜日$/, list: ['月曜日','火曜日','水曜日','木曜日','金曜日','土曜日','日曜日'] }, 
		{ pattern: /^(?:true|false)$/  , list: ['true', 'false'] }, 
		{ pattern: /^(?:True|False)$/  , list: ['True', 'False'] }
	];

(function() {
	if (!typeof macro_args) {
		Editor.TraceOut('Error: macro_args is undefind');
		return;
	}
	var delta = macro_args.delta;  // 次/前に進む量
	var seltext = Editor.GetSelectedString();
	
	// 選択テキストの次/前のテキストを取得
	var replacement = null;
	var matches = /^[+\-]?[0-9]\d*$/.exec(seltext);
	if (matches) {
		replacement = String(Number(seltext) + delta);
		if (seltext.charAt(0) === '+' && replacement.charAt(0) !== '-') replacement = '+' + replacement;
	} else {
		var is_matches = lists.some(
			function(e) {
				if (!e.pattern.test(seltext))
					return false;
				
				var l = e.list.length;
				var i = e.list.indexOf(seltext);
				if (i == -1) throw new Error(seltext + ' is not found in lists.list');
				i += delta;
				while (i < 0) i += l;
				i %= l;
				
				replacement = e.list[i];
				return true;
			});
		if (!is_matches) return;
	}
	
	// 選択テキストを次/前のテキストに変更
	// 連続して実行できるように、テキスト選択状態を維持する
	Editor.Delete();
	Editor.InsText(replacement);
	for (var i=0; i < replacement.length; i++) Editor.Left_Sel();
})();
