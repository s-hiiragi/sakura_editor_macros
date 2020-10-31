/**
 * @file grep_selection.js
 */

var selection = Editor.GetSelectedString();

// 0x6300: 文字コード自動選択 が機能しないので明示的に文字コードを指定する
// ==> そもそも文字コードを指定するオプションが機能していない
//var charCode = ({0: 0x0000, 4: 0x0400})[Editor.GetCharCode()];
// ==> 文字コード自動判別オプションを使う
// ==> このオプションも機能していない
Editor.Grep(selection, Editor.ExpandParameter('$f'),
	Editor.ExpandParameter('$e'), 0x64+0x10+0x02/*編集中のテキストから検索(未実装)*/);
//	charCode);
