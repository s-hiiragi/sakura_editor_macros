/**
 * @name         <sakura-macro>/modules/commons/language.js
 * @description  JavaScript言語機能の拡張
 * @author       s_hiiragi (https://github.com/s-hiiragi)
 * @updated      2013/10/13 12:17:09 JST
 */

load('commons/es5.js');

// Array ジェネリックメソッド
// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array#Array_generic_methods
(function () {
	'use strict';
	
	var i,
		// 下記の方法で array のメソッドを構築することも可能ですが、
		//   getOwnPropertyNames() メソッドはシムを適用できません:
		// Object.getOwnPropertyNames(Array).filter(function (methodName) {return typeof Array[methodName] === 'function'});
		methods = [
			'join', 'reverse', 'sort', 'push', 'pop', 'shift', 'unshift',
			'splice', 'concat', 'slice', 'indexOf', 'lastIndexOf',
			'forEach', 'map', 'reduce', 'reduceRight', 'filter',
			'some', 'every', 'isArray'
		],
		methodCount = methods.length,
		assignArrayGeneric = function (methodName) {
			var method = Array.prototype[methodName];
			Array[methodName] = function (arg1) {
				return method.apply(arg1, Array.prototype.slice.call(arguments, 1));
			};
		};

	for (i = 0; i < methodCount; i++) {
		assignArrayGeneric(methods[i]);
	}
}());

/**
 * makeError(name)
 * 例外クラスを生成する
 * 
 * name : string
 *   例外クラス名
 * 
 * usage:
 *   var HogeError = new MakeError('HogeError');
 *   try {
 *     throw new makeError('FugaError')('message');
 *   } catch (ex) {
 *     p(ex); // FugaError: message
 *   }
 */
exports.makeError = function(name) {
	var ctor = new Function(
			'function ' + name + '(message) { \r\n'
				// new makeError(name)(message)と記述出来るようにするハック
				+ '  if (!(this instanceof ' + name + ')) { \r\n'
				+ '    return new ' + name + '(message); \r\n'
				+ '  } \r\n'
			+ '  this.message = message; \r\n'
			+ '} \r\n'
			+ name + '.prototype = new Error(); \r\n'
			+ name + '.prototype.name = "' + name + '"; \r\n'
			+ 'return ' + name + ';'
	)();
	return ctor;
};

/**
 * String#quote() => string
 * '"'で括った文字列を返す
 * 
 * 参考
 * https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/quote
 */
String.prototype.quote = function() {
	return '"' + this.replace(/[\\"]/, '\\$&') + '"';  //'
};
/**
 * String#starts(str) => boolean
 * 文字列の先頭にstrがあるかチェック
 * 
 * str : string
 *   先頭にあるべき文字列
 * 
 * 備考
 *   ES6 HarmonyのString#startsWith()と機能が重複する
 */
String.prototype.starts = function(str) { // imported from Java (String#starts)
	return this.indexOf(str) != -1;
};
/**
 * String#ends(str) => boolean
 * 文字列の末尾にstrがあるかチェック
 * 
 * str : string
 *   末尾にあるべき文字列
 * 
 * 備考
 *   ES6 HarmonyのString#endsWith()と機能が重複する
 */
String.prototype.ends = function(str) { // imported from Java (String#ends)
	return this.lastIndexOf(str) == this.length-str.length;
};
/**
 * String#trimLeft() => string [ES Harmony]
 * 
 * 参考
 * https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/TrimLeft
 */
String.prototype.trimLeft = function() {
	return this.replace(/^\s+/, '');
};
/**
 * String#trimRight() => string [ES Harmony]
 * 
 * 参考
 * https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/TrimRight
 */
String.prototype.trimRight = function() {
	return this.replace(/\s+$/, '');
};


/**
 * Object#keys() => Array
 * Object.keys()のメソッド版
 * 
 * Object自身が持つプロパティの名前の配列を返す
 * 註) Object自身が"keys"という名前のプロパティを持つ場合はObject.keys()を使用
 *     すること。
 */
Object.prototype.keys = function() {
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var a = [];
	for (var k in this) {
		if (hasOwnProperty.call(this, k)) {
			a.push(k);
		}
	}
	return a;
};
/**
 * Object#values() => Array
 * Object自身が持つプロパティの値の配列を返す
 */
Object.prototype.values = function() {
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var a = [];
	for (var k in this) {
		if (hasOwnProperty.call(this, k)) {
			a.push(k);
		}
	}
	return a;
};
/**
 * Object#each(callback, thisp) => object
 * オブジェクトの各キーに対して処理をする
 */
Object.prototype.each = function(callback, thisp) {
	if (arguments.length === 0) {
		throw new TypeError('no callback');
	}
	if (typeof callback !== 'function') {
		throw new TypeError('callback is not a function');
	}
	thisp || (thisp = null);
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	for (var k in this) {
		if (hasOwnProperty.call(this, k)) {
			if (callback.call(thisp, this[k], k) === false) break;
		}
	}
	return this;
};
Object.prototype._toString = Object.prototype.toString;
Object.prototype.toString = function() { // for debug
	if (this.constructor != Object) {
		return this._toString();
	}
	var keys = this.keys();
	var a = [];
	for (var i=0; i < keys.length; i++) {
		var k = keys[i];
		var v = this[k];
		a.push(k + ':' + v);
	}
	return '{ ' + a.join(', ') + ' }';
};


/**
 * Array#each(callback[, thisp]) => Array
 * 
 * callback : function(element, index) => any
 *   要素ごとに呼び出されるコールバック関数
 *   falseを返すとeach()を終了する。
 * 
 * thisp : object
 *   コールバック関数のthis値
 */
Array.prototype.each = function(callback, thisp) {
	if (this == null) {
		throw new TypeError('this is null or undefined');
	}
	if (arguments.length === 0) {
		throw new TypeError('no callback');
	}
	if (typeof callback !== 'function') {
		throw new TypeError('callback is not a function');
	}
	thisp || (thisp = null);
	var t = Object(this);  // Array以外の型にも適用可能にする
	var len = t.length >> 0;  // 整数として無効な値は0となる
	
	for (var i=0; i < len; i++) {
		if (i in t) {
			if (callback.call(thisp, t[i], i) === false) break;
		}
	}
	return this;
};
Array.prototype._toString = Array.prototype.toString;
Array.prototype.toString = function() { // for debug
	return '[' + this._toString() + ']';
};


Error.prototype._toString = Error.prototype.toString;
Error.prototype.toString = function() { // for debug
	// TODO descriptionはmessageとどう違う？
	return this.name + ': ' + this.message;
};
