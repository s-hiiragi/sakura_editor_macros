/**
 * @file    サクラエディタマクロ共有コード
 * @author  s_hiiragi (https://github.com/s-hiiragi)
 */

// debug が定義されていいれば、booleanに変換
// 未定義の場合、falseとなる
var debug = !!debug;


// TODO commonsディレクトリ以下のコードを依存関係に注意して自動的にロードしたい
load('commons/sakura.js');
load('commons/language.js');
load('commons/es5.js');
load('commons/es6.js');
