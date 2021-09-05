/**
 * @file    サクラエディタマクロモジュールのサンプル
 * @author  s_hiiragi (https://github.com/s-hiiragi)
 */

println('modulepath = ' + modulepath);


// 外部公開するオブジェクトはexportsオブジェクトのプロパティにセットします。
exports.printHello = function() {
	println('Hello SakuraMacroLib!!');
};

// 必要なライブラリはload()関数を使ってロードします。
load('commons/es5.js');

// プロトタイプ拡張は通常通り行います。
Array.prototype.sum = function() {
	//return this.reduce(function(a,b) {return a+b}, 0);
	var n = 0;
	this.forEach(function(e) {
		n += e;
	});
	return n;
};
