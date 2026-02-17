/*
 * compile_khpx.js
 * khpxファイルをkhpファイルにコンパイル
 */

/*
 * NOTE: khpxファイルの記載ルール
 * - ファイルのエンコーディングはUTF-8 BOM付き固定とする
 * - 改行コードは\r\nとする
 * - `///`の後に改行がある場合、次の空行までを\nで連結する
 * - 説明中に空行を入れたい場合は`\n`だけの行を記述する
 */

(function(){
    var inFilename = Editor.GetFilename();
    if (!/\.khpx/.test(inFilename)) {
        Editor.ErrorMsg('ファイルの拡張子が.khpxではありません。');
        return;
    }
    var outFilename = inFilename.replace(/\.khpx/, '.khp');

    // read .khpx file
    var inText = '';
    (function(){
        var stream = new ActiveXObject('ADODB.Stream');
        stream.Charset = 'UTF-8';
        stream.Open();
        stream.LoadFromFile(inFilename);
        inText = stream.ReadText();
        stream.Close();
    })();

    // compile khpx to khp
    var outText = '';
    (function(){
        var lines = inText.split('\r\n');
        var buff = [];
        var isInMultiLineText = false;
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];

            if (isInMultiLineText) {
                if (line === '') {
                    isInMultiLineText = false;
                    line = lastLine.replace(/\\n$/, '');
                    buff.push(line);
                }
                else {
                    lastLine += line + '\\n';
                }
            }
            else {
                if (/\/\/\/$/.test(line)) {
                    isInMultiLineText = true;
                    lastLine = line + ' \\n'; // マウスカーソルが大きいとツールチップが重なるので空行を入れる
                }
                else {
                    buff.push(line);
                }
            }
        }
        outText = buff.join('\r\n') + '\r\n';
    })();

    // write .khp file
    (function(){
        var stream = new ActiveXObject('ADODB.Stream');
        stream.Charset = 'UTF-8';
        stream.Type = 2; // 2:テキストファイル
        stream.Open();
        stream.WriteText(outText);
        stream.SaveToFile(outFilename, 2);  // 2:上書き保存
        stream.Close();
    })();

    Editor.InfoMsg(outFilename + ' を出力しました。');
})();
