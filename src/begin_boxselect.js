﻿/*
 * 矩形選択開始（拡張）
 *
 * - 折り返しを「折り返さない」に設定する
 *   - 折り返しを含むテキストを矩形選択して編集した場合、意図しない結果となるため。
 *
 * 推奨ショートカットキー: F6
 */

Editor.TextWrapMethod(0);
Editor.BeginBoxSelect();