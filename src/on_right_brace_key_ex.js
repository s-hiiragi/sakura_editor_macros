/*
 * on_right_brace_key_ex.js
 * '>'キー (拡張)
 *
 * 機能
 *
 * テキスト未選択時: '>'を入力
 * テキスト選択時: 選択範囲の各行の行頭に'> 'を挿入 (Markdown 引用)
 *
 * 使用方法
 *
 * - 共通設定＞マクロを開き、本ファイルを登録する
 * - 共通設定＞キー割り当てを開き、本マクロを'Shift+.'キーに割り当てる
 */

switch (Editor.IsTextSelected()) {
case 0: // 非選択状態
    Editor.InsText('>');
    break;
case 1: // 選択中
    var itext = Editor.GetSelectedString(0);
    var lines = itext.replace(/\r\n/g, '\n').split('\n');
    var newline = ['\r\n', '\r', '\n'][Editor.GetLineCode()];
    var prefix = '> ';
    var otext;
    if (lines[lines.length-1] === '') {
        otext = prefix + lines.slice(0, lines.length-1).join(newline + prefix) + newline;
    } else {
        otext = prefix + lines.join(newline + prefix);
    }
    Editor.InsText(otext);
    break;
case 2: // 矩形選択中
    Editor.InsText('>');
    break;
}
