/* 指定した見出しに移動
 *
 * カーソル行の次の行から見出しを検索する
 * 見出しは 1.完全一致 2.部分一致 の順に一致するものを探す
 * 見出しを探す際、大文字/小文字は区別しない
 *
 * 対応している見出しフォーマット
 * - Markdown ('#'で始まる行)
 * - その他 ([共通設定]-[書式]-[見出し記号]の記号で始まる行)
 *
 * 推奨ショートカットキー: Alt+S
 */

function getSections(matcher) {
    var sections = [];

    var lineCount = Editor.GetLineCount(0);
    for (var i = 1; i <= lineCount; i++) {
        var line = Editor.GetLineStr(i).replace(/[\r\n]{1,2}$/, '');
        if (line && matcher.test(line)) {
            sections.push({
                text: matcher.exec(line)[1],
                line: i
            });
        }
    }

    return sections;
}

(function(){
    // 検索する見出しを入力する
    var inputSection = Editor.InputBox('見出し', '', 100);
    if (!inputSection) return;

    // 拡張子ごとに見出しの抽出方法を変更する
    var ext = Editor.ExpandParameter('$b');

    var matcher;
    if (/^(?:md|markdown)$/.test(ext)) {
        matcher = /^#+\s+(.*)/;
    } else {
        matcher = /^[１２３４５６７８９０（(［[「『【■□▲△▼▽◆◇○◎●§・※☆★第①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ一二三四五六七八九十壱弐参伍](.*)/;
    }

    // 見出しを抽出する
    var sections = getSections(matcher);

    // カーソル行+1から見出しを検索するために、
    // カーソル行+1以降の最初の見出しを検索する
    var currentLine = Editor.ExpandParameter('$y');

    var startIndex = 0;
    for (var i = 0; i < sections.length; i++) {
        if (sections[i].line > currentLine) {
            startIndex = i;
            break;
        }
    }

    // 完全一致で検索する
    var sectionLine = null;

    for (var i = 0, j = startIndex; i < sections.length; i++) {
        var section = sections[j];

        if (section.text.toLowerCase() === inputSection.toLowerCase()) {
            sectionLine = section.line;
            break;
        }

        j++;
        if (j >= sections.length) {
            j = 0;
        }
    }

    // 見つからなければ部分一致で検索する
    if (!sectionLine) {
        for (var i = 0, j = startIndex; i < sections.length; i++) {
            var section = sections[j];

            if (section.text.toLowerCase().indexOf(inputSection.toLowerCase()) >= 0) {
                sectionLine = section.line;
                break;
            }

            j++;
            if (j >= sections.length) {
                j = 0;
            }
        }
    }

    // 見つからなければ終了する
    if (!sectionLine) {
        return;
    }

    // 見つかった見出し行へカーソルを移動する
    Editor.MoveCursor(sectionLine, 1, 0);
})();
