/**
 * @file  ドキュメントのあるディレクトリをrgコマンドで検索
 */

/*
 * 課題
 * - 行番号が出力されないのが致命的
 */

var dir = Editor.ExpandParameter('$e');
var kwd = Editor.InputBox('検索ワード', '', 100);

var opt = 0;
opt |= 0x01;  // 標準出力を得る
opt |= 0x80;  // 標準出力をUTF-8で行う

if (kwd) {
    Editor.ExecCommand('rg ' + kwd + ' ' + dir, opt);
}
