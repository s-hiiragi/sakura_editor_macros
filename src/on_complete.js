/**
 * @file  入力補完（拡張）
 *
 * 推奨ショートカットキー: Ctrl+Space
 */

// メモ:
// - サクラエディタの入力補完仕様
// -- 記号は単語の区切り
// -- 記号とは？
// -- 単語とは？

// 問題:
// - プラグインではないので通常の入力補完と同じように候補を表示できない→メニューを使う
// - プラグインではないので入力補完オプションを取得できない
// - スニペットが1つしかないときでも候補(メニュー)を表示してしまう
// - スニペットが重複しているので、各スニペットの使いたいケースを整理したい
// -- 例えば、"document.querySelector"はnull/indent/spaceすべてのケースで入力したい
// -- JSDocトップレベルコメントはnullの時だけ入力したい

// 課題:
// - headSnippetsとindentSnippetsは一部共通化したい
// - スニペット候補がないときに通常の入力補完と同じようにビープ音を出したい
// -- スニペット候補を出すのは行頭orインデントor空白の位置なので、普通にComplete()を呼べばよい?
// - 単語と記号で文脈を区別するか検討する

// [x] インデント自動挿入 
// TODO カーソル自動移動 (カーソル移動マクロをTabに割り付ける前提)

// 文脈ごとの動作を定義
var actionsInContexts = {
	'null'   : ShowHeadSnippetMenu,
	'indent' : ShowIndentSnippetMenu,
	'space'  : ShowTailSnippetMenu,
	'word'   : DoComplete
};

var headSnippets = [
	{
		file_pattern: /\.js$/,
		caption: 'JSDoc: トップレベルコメント',
		content: [
			'/**',
			' * @fileoverview',
			' */',
			''
		].join('\r\n')
	},
	{
		file_pattern: /\.js$/,
		caption: 'function文',
		content: [
			'function f() {',
			'    ',
			'}',
			''
		].join('\r\n')
	},
	{
		file_pattern: /\.js$/,
		caption: '無名関数ブロック',
		content: [
			'(function(){',
			'    ',
			'});',
			''
		].join('\r\n')
	}
	
];

var indentSnippets = [
	{
		file_pattern: /\.js$/,
		caption: 'if文',
		content: [
			'if () {',
			'    ',
			'}',
			''
		].join('\r\n')
	},
	{
		file_pattern: /\.js$/,
		caption: 'for文',
		content: [
			'for () {',
			'    ',
			'}',
			''
		].join('\r\n')
	},
	{
		file_pattern: /\.js$/,
		caption: '無名関数ブロック',
		content: [
			'(function(){',
			'    ',
			'});',
			''
		].join('\r\n')
	},
	{
		file_pattern: /\.js$/,
		caption: '&querySelector',
		content: 'document.querySelector("")'
	},
	{
		file_pattern: /\.js$/,
		caption: 'querySelector&All',
		content: 'document.querySelectorAll("")'
	}
];

var tailSnippets = [
	{
		file_pattern: /\.js$/,
		caption: '&querySelector',
		content: 'document.querySelector("")'
	},
	{
		file_pattern: /\.js$/,
		caption: 'querySelector&All',
		content: 'document.querySelectorAll("")'
	},
	{
		file_pattern: /\.js$/,
		caption: '無名関数',
		content: 'function(){  }'
	}
];

//function DoNothing() {}

function DoComplete() { Editor.Complete(); }

function showSnippetMenu_(contextOptions, snippets) {
	var matchedSnippets = [];

	var menuCaptions = [];
	for (var i = 0; i < snippets.length; i++) {
		var temp = snippets[i];

		if (temp.file_pattern) {
			var filepath = Editor.GetFilename();
			if (!temp.file_pattern.test(filepath)) {
				continue;
			}
		}

		menuCaptions.push(temp.caption);
		matchedSnippets.push(temp);
	}
	if (matchedSnippets.length == 0) return;  // 候補なし

	var itemNum = Editor.CreateMenu(1, menuCaptions.join(','));
	if (itemNum == 0) return;

	var temp = matchedSnippets[itemNum - 1];

	var content = temp.content;
	if (contextOptions.indent) {
		content = content.replace(/\r?\n/gm, '$&' + contextOptions.indent);
	}

	Editor.InsText(content);
}

function ShowHeadSnippetMenu(contextOptions) {
	showSnippetMenu_(contextOptions, headSnippets);
}

function ShowIndentSnippetMenu(contextOptions) {
	showSnippetMenu_(contextOptions, indentSnippets);
}

function ShowTailSnippetMenu(contextOptions) {
	showSnippetMenu_(contextOptions, tailSnippets);
}

var currentLine = Editor.GetLineStr(0);
var cursorPos = Editor.ExpandParameter('$x') - 1;  // 0開始
var leftString = currentLine.substring(0, cursorPos);

var context;
var contextOptions = {};
if (leftString == '') {
	context = 'null';
} else if (/^[ \t]+$/.test(leftString)) {
	context = 'indent';
	contextOptions.indent = leftString;
} else if (/\s$/.test(leftString)) {
	context = 'space';
} else {
	context = 'word';
	//contextOptions.currentWord = /[^記号\s]$|[記号]$/.match(leftString)[0];  // TODO 実装する (Complement.GetCurrentWord相当)
}

actionsInContexts[context](contextOptions);
