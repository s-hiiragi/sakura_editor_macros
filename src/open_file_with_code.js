/**
 * @file  ファイルをVS Codeで開く
 */

var codePath = 'C:\\Program Files\\Microsoft VS Code\\bin\\code.cmd';
var docPath = Editor.ExpandParameter('$F');
var cmd = '"' + codePath + '" "' + docPath + '"';

Editor.ExecCommand(cmd, 0);
