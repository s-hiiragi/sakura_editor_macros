/**
 * @file  ���͕⊮�i�g���j
 *
 * �����V���[�g�J�b�g�L�[: Ctrl+Space
 */

// ����:
// - �T�N���G�f�B�^�̓��͕⊮�d�l
// -- �L���͒P��̋�؂�
// -- �L���Ƃ́H
// -- �P��Ƃ́H

// ���:
// - �v���O�C���ł͂Ȃ��̂Œʏ�̓��͕⊮�Ɠ����悤�Ɍ���\���ł��Ȃ������j���[���g��
// - �v���O�C���ł͂Ȃ��̂œ��͕⊮�I�v�V�������擾�ł��Ȃ�
// - �X�j�y�b�g��1�����Ȃ��Ƃ��ł����(���j���[)��\�����Ă��܂�
// - �X�j�y�b�g���d�����Ă���̂ŁA�e�X�j�y�b�g�̎g�������P�[�X�𐮗�������
// -- �Ⴆ�΁A"document.querySelector"��null/indent/space���ׂẴP�[�X�œ��͂�����
// -- JSDoc�g�b�v���x���R�����g��null�̎��������͂�����

// �ۑ�:
// - headSnippets��indentSnippets�͈ꕔ���ʉ�������
// - �X�j�y�b�g��₪�Ȃ��Ƃ��ɒʏ�̓��͕⊮�Ɠ����悤�Ƀr�[�v�����o������
// -- �X�j�y�b�g�����o���͍̂s��or�C���f���gor�󔒂̈ʒu�Ȃ̂ŁA���ʂ�Complete()���Ăׂ΂悢?
// - �P��ƋL���ŕ�������ʂ��邩��������

// [x] �C���f���g�����}�� 
// TODO �J�[�\�������ړ� (�J�[�\���ړ��}�N����Tab�Ɋ���t����O��)

// �������Ƃ̓�����`
var actionsInContexts = {
	'null'   : ShowHeadSnippetMenu,
	'indent' : ShowIndentSnippetMenu,
	'space'  : ShowTailSnippetMenu,
	'word'   : DoComplete
};

var headSnippets = [
	{
		file_pattern: /\.js$/,
		caption: 'JSDoc: �g�b�v���x���R�����g',
		content: [
			'/**',
			' * @fileoverview',
			' */',
			''
		].join('\r\n')
	},
	{
		file_pattern: /\.js$/,
		caption: 'function��',
		content: [
			'function f() {',
			'    ',
			'}',
			''
		].join('\r\n')
	},
	{
		file_pattern: /\.js$/,
		caption: '�����֐��u���b�N',
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
		caption: 'if��',
		content: [
			'if () {',
			'    ',
			'}',
			''
		].join('\r\n')
	},
	{
		file_pattern: /\.js$/,
		caption: 'for��',
		content: [
			'for () {',
			'    ',
			'}',
			''
		].join('\r\n')
	},
	{
		file_pattern: /\.js$/,
		caption: '�����֐��u���b�N',
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
		caption: '�����֐�',
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
	if (matchedSnippets.length == 0) return;  // ���Ȃ�

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
var cursorPos = Editor.ExpandParameter('$x') - 1;  // 0�J�n
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
	//contextOptions.currentWord = /[^�L��\s]$|[�L��]$/.match(leftString)[0];  // TODO �������� (Complement.GetCurrentWord����)
}

actionsInContexts[context](contextOptions);
