/*
 * on_j_key_ex.js
 * jキー (拡張)
 *
 * 機能
 *
 * テキスト未選択時: 'j'を入力
 * テキスト選択時: 選択範囲を'```js ... ```'で囲む (Markdown コードブロック)
 *
 * 使用方法
 *
 * - 共通設定＞マクロを開き、本ファイルを登録する
 * - 共通設定＞キー割り当てを開き、本マクロを'J'キーに割り当てる
 */

switch (Editor.IsTextSelected()) {
case 0: // 非選択状態
case 2: // 矩形選択中
    Editor.InsText('j');
    break;
case 1: // 選択中
    var itext = Editor.GetSelectedString(0);
    var otext;
    var newline = ['\r\n', '\r', '\n'][Editor.GetLineCode()];
    if (/\n$/.test(itext)) {
        otext = '```js' + newline + itext.replace(/\r?\n$/, '') + newline + '```' + newline;
    } else {
        otext = '```js' + newline + itext + newline + '```';
    }
    Editor.InsText(otext);
    break;
}
