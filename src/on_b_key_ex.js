/*
 * on_b_key_ex.js
 * bキー (拡張)
 *
 * 機能
 *
 * テキスト未選択時: 'b'を入力
 * テキスト選択時: 選択範囲を'javascript:(()=>{ ... })()'で囲む (Bookmarklet)
 *
 * 使用方法
 *
 * - 共通設定＞マクロを開き、本ファイルを登録する
 * - 共通設定＞キー割り当てを開き、本マクロを'J'キーに割り当てる
 */

switch (Editor.IsTextSelected()) {
case 0: // 非選択状態
case 2: // 矩形選択中
    Editor.InsText('b');
    break;
case 1: // 選択中
    var itext = Editor.GetSelectedString(0);
    var otext;
    if (/\n/.test(itext)) {
        // 行選択中
        var newline = ['\r\n', '\r', '\n'][Editor.GetLineCode()];
        if (/\n$/.test(itext)) {
            otext = 'javascript:(()=>{' + newline + itext.replace(/\r?\n$/, '') + newline + '})()' + newline;
        } else {
            otext = 'javascript:(()=>{' + newline + itext + newline + '})()';
        }
    } else {
        otext = 'b';
    }
    Editor.InsText(otext);
    break;
}
