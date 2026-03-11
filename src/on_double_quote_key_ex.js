/*
 * on_dquote_key_ex.js
 * ダブルクォートキー (拡張)
 *
 * 機能
 *
 * テキスト未選択時: '"'を入力
 * テキスト選択時: 選択範囲を'"'で囲む
 *
 * 使用方法
 *
 * - 共通設定＞マクロを開き、本ファイルを登録する
 * - 共通設定＞キー割り当てを開き、本マクロを'Shift+2'キーに割り当てる
 */

switch (Editor.IsTextSelected()) {
case 0: // 非選択状態
case 2: // 矩形選択中
    Editor.InsText('"');
    break;
case 1: // 選択中
    var itext = Editor.GetSelectedString(0);
    var otext = '"' + itext + '"';
    Editor.InsText(otext);
    break;
}
