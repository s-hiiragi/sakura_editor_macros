/**
 * @file  コマンドパレットを開く
 *
 * 推奨ショートカットキー: Ctrl+Shift+P
 */
function evalInGlobalScope(__code) {
    return eval(__code);
}

(function(){

    var fso = new ActiveXObject('Scripting.FileSystemObject');
    var wsh = new ActiveXObject('WScript.Shell');

    // キー名がコマンド名となる
    //
    // 指定可能なプロパティ
    // {string[]} aliases - コマンド名の別名を定義する (省略可能)
    // {string}   name    - コマンドの短い説明
    // {function} func    - コマンドの処理 (省略時はキー名をマクロAPI名として実行)
    //                      function(args, opts) {...}
    //                      {string[]} args       - 引数の配列 (引数はスペース区切り)
    //                      {string}   opts.input - 引数全体の文字列
    var commands = {

        // 組込みコマンド

        'help': {
            'name': 'ヘルプを表示',
            'func': function(args, opts) {
                // 引数に絞り込みワードを指定できる
                var match = function(k) { return true; }
                if (args[0]) {
                    match = function(k) {
                        return k.toLowerCase().indexOf(args[0].toLowerCase()) >= 0;
                    }
                }

                var keys = [];
                for (var k in commands) {
                    if (commands.hasOwnProperty(k)) {
                        if (match(k)) { keys.push(k); }
                    }
                }

                var maxlen = 0;
                for (var i = 0; i < keys.length; i++) {
                    if (keys[i].length > maxlen) { maxlen = keys[i].length; }
                }

                var lines = [];
                for (var i = 0; i < keys.length; i++) {
                    var k = keys[i];
                    var kk = (k + '                              ').slice(0, maxlen);
                    lines.push(kk + ' : ' + commands[k].name);
                }
                Editor.TraceOut(lines.join('\r\n'));
            }
        },

        'edit': {
            'name': 'コマンドパレットマクロを編集',
            'func': function(args, opts) {
                Editor.FileOpen(Editor.ExpandParameter('$M'));
            }
        },

        'eval': {
            'name': 'マクロを評価',
            'func': function(args, opts) {
                // 引数がある場合はそれを実行
                var input = opts.input || Editor.InputBox('マクロを入力', '', 1024);
                if (!input) { return; }

                var result = evalInGlobalScope(input);
                if (typeof result !== 'undefined') {
                    Editor.InputBox('実行結果', result, 1024);
                }
            }
        },

        'ExpandParameter': {
            'aliases': ['ep'],
            'name': 'ExpandParameterを実行',
            'func': function(args, opts) {
                // 引数がある場合はそれを実行
                var input = opts.input || Editor.InputBox('展開したい特殊文字列を入力', '', 1024);
                if (!input) { return; }

                var result = ExpandParameter(input);
                Editor.InputBox('実行結果', result, 1024);
            }
        },

        'OpenCommandPrompt': {
            'aliases': ['cmd'],
            'name': 'コマンドプロンプトを開く',
            'func': function(args, opts) {
                wsh.Run('cmd.exe', 5, false);
            }
        },

        'OpenPowerShell': {
            'aliases': ['pwsh'],
            'name': 'PowerShellを開く',
            'func': function(args, opts) {
                wsh.Run('powershell.exe -NoLogo -ExecutionPolicy RemoteSigned', 5, false);
            }
        },

        'append': {
            'name': 'メモをノートに追加',
            'func': function(args, opts) {
                if (args.length < 2) {
                    WarnMsg('引数が足りません。\n使い方: append {ノート名} {メモ}');
                    return;
                }
                var notename = args[0];
                var memo = opts.input.replace(/^\S+\s+/, '');
            }
        },

        // -- メニューにあるコマンド

        // ファイル

        'FileNew': { 'name': '新規作成' },

        'FileSaveAsDialog': {
            'aliases': ['SaveAs'],
            'name': '名前を付けて保存'
        },

        'FileClose'     : { 'name': '閉じて(無題)' },
        'FileReopenSJIS': { 'name': 'SJISで開き直す' },
        'FileReopenUTF8': { 'name': 'UTF-8で開き直す' },

        // 編集

        'CopyLinesAsPassage'         : { 'name': '選択範囲内全行引用符付きコピー' },
        'CopyLinesWithLineNumber'    : { 'name': '選択範囲内全行行番号付きコピー' },
        'CopyColorHtml'              : { 'name': '選択範囲内色付きHTMLコピー' },
        'CopyColorHtmlWithLineNumber': { 'name': '選択範囲内色付きHTMLコピー' },

        'CopyFilename': { 'name': 'このファイル名をコピー ' },
        'CopyFolder'  : { 'name': 'このファイルのフォルダ名をコピー ' },
        'CopyPath'    : { 'name': 'このファイルのパス名をコピー' },
        'CopyTag'     : { 'name': 'このファイルのパス名とカーソル位置をコピー ' },

        // 変換

        'ToLower'   : { 'name': '英大文字→英小文字' },
        'ToUpper'   : { 'name': '英小文字→英大文字' },
        'ToHankaku' : { 'name': '全角→半角' },
        'ToHanEi'   : { 'name': '全角英数→半角英数' },
        'ToZenEi'   : { 'name': '半角英数→全角英数' },
        'TABToSPACE': { 'name': 'TAB→空白' },
        'SPACEToTAB': { 'name': '空白→TAB' },

        // 検索

        'BookmarkView': { 'name': 'ブックマークの一覧' },

        'ShowOutline': {
            'name': 'アウトライン解析を表示(再解析)',
            'func': function(args, opts) {
                Editor.Outline(1);
            }
        },

        'ToggleOutline': {
            'name': 'アウトライン解析を表示/非表示',
            'func': function(args, opts) {
                Editor.Outline(2);
            }
        },

        // ツール

        'ExecExternalMacro': {
            'aliases': ['macro'],
            'name': '名前を指定してマクロ実行'
        },

        'ExecCommand': {
            'aliases': ['exec', '!'],
            'name': '外部コマンド実行',
            'func': function(args, opts) {
                // 引数がある場合はそれを実行
                var input = opts.input || Editor.InputBox('外部コマンドを入力', '', 1024);
                if (!input) { return; }

                Editor.ExecCommand(input, 1);
            }
        },

        // 設定

        'ShowToolbar'    : { 'name': 'ツールバーを表示/非表示' },
        'ShowFunckey'    : { 'name': 'ファンクションキーを表示/非表示' },
        'ShowTab'        : { 'name': 'タブバーを表示/非表示' },
        'ShowStatusbar'  : { 'name': 'ステータスバーを表示/非表示' },
        'ShowMiniMap'    : { 'name': 'ミニマップを表示/非表示' },
        'TypeList'       : { 'name': 'タイプ別設定一覧を開く' },
        'OptionType'     : { 'name': 'タイプ別設定を開く' },
        'OptionCommon'   : { 'name': '共通設定を開く' },
        'SelectFont'     : { 'name': 'フォント設定を開く' },
        'OptionFavorite' : { 'name': '履歴の管理を開く' },
        'WrapWindowWidth': { 'name': '折り返し/非折り返しを切り替える' },

        'ViewMode': {
            'aliases': ['ReadOnly'],
            'name': 'ビューモードに変更/戻す'
        },

        'ChgCharSet': { 'name': '文字コードセット指定を開く' },

        'ChgmodEOLCrLf': {
            'name': '入力改行コード指定をCRLF(Windows)に変更',
            'func': function() { Editor.ChgmodEOL(1); }
        },

        'ChgmodEOLLf': {
            'name': '入力改行コード指定をLF(UNIX)に変更',
            'func': function() { Editor.ChgmodEOL(3); }
        },

        // ウィンドウ

        'WinClose': { 'name': 'タブを閉じる' },

        'WindowTopMost': { 'name': '常に手前に表示/解除' },

        'SetWindowTopMost': {
            'name': '常に手前に表示',
            'func': function() { Editor.WindowTopMost(1); }
        },

        'UnsetWindowTopMost': {
            'name': '常に手前に表示を解除',
            'func': function() { Editor.WindowTopMost(2); }
        },

        'ActivateWinOutput': { 'name': 'アウトプットウィンドウを表示/非表示' },

        // ヘルプ

        // 実験的なコマンド

        'h': {
            'name': 'ExpandParameterのヘルプを開く',
            'func': function(args, opts) {
                //Editor.FileOpen();
                var sakuraDir = fso.GetParentFolderName(Editor.ExpandParameter('$S'));
                var helpPath = fso.BuildPath(sakuraDir, 'sakura.chm');
                Editor.ExecCommand('hh.exe ' + helpPath + '::/res/HLP000284.html', 0);
            }
        }
    };

    // add "canonicalName" property automatically
    for (var k in commands) {
        commands[k]['canonicalName'] = k;
    }

    var cmdNameMap = (function(){
        var m = {};

        for (var k in commands) {
            if (commands.hasOwnProperty(k)) {
                m[k.toLowerCase()] = commands[k];

                var aliases = commands[k].aliases;
                if (aliases) {
                    for (var i = 0; i < aliases.length; i++) {
                        m[aliases[i].toLowerCase()] = commands[k];
                    }
                }
            }
        }

        return m;
    })();

    var input = Editor.InputBox('コマンドを入力 (ヘルプは`help`)', '', 1024);
    if (!input) { return; }

    var args = input.split(/\s+/);
    var cmdName = args.shift();

    var cmdInfo = cmdNameMap[cmdName.toLowerCase()];
    if (!cmdInfo) {
        WarnMsg('コマンドが見つかりません');
        return;
    }

    var opts = {
        'input': input.replace(/^\S+\s*/, '')
    };
    if (cmdInfo.func) {
        Editor.AddRefUndoBuffer();
        cmdInfo.func(args, opts);
        Editor.SetUndoBuffer();
    } else {
        Editor.AddRefUndoBuffer();
        Editor[cmdInfo.canonicalName]();
        Editor.SetUndoBuffer();
    }

})();
