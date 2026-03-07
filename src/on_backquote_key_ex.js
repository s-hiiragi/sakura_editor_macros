/*
 * on_backquote_key_ex.js
 * バッククォートキー (拡張)
 *
 * 機能
 *
 * テキスト未選択時: '`'を入力
 * テキスト１行選択時: 選択範囲を'`'で囲む (Markdown インラインコード)
 * テキスト複数行選択時: 選択範囲を'```'で囲む (Markdown コードブロック)
 *
 * 使用方法
 *
 * - 共通設定＞マクロを開き、本ファイルを登録する
 * - 共通設定＞キー割り当てを開き、本マクロを'Shift+@'キーに割り当てる
 */

switch (Editor.IsTextSelected()) {
case 0: // 非選択状態
    Editor.InsText('`');
    break;
case 1: // 選択中
    var itext = Editor.GetSelectedString(0);
    var otext;
    if (itext.indexOf('\n') === -1) {
        otext = '`' + itext + '`';
    } else {
        var newline = ['\r\n', '\r', '\n'][Editor.GetLineCode()];
        if (/\n$/.test(itext)) {
            otext = '```' + newline + itext.replace(/\r?\n$/, '') + newline + '```' + newline;
        } else {
            otext = '```' + newline + itext + newline + '```';
        }
    }
    Editor.InsText(otext);
    break;
case 2: // 矩形選択中
    Editor.InsText('`');
    break;
}
