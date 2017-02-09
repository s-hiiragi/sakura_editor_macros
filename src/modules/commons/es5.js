/**
 * @name         <sakura-macro>/modules/commons/es5.js
 * @description  ES5 のPolyfill
 * @author       s_hiiragi (https://github.com/s-hiiragi)
 * @updated      2013/10/13 12:35:16 JST
 */

if (!String.prototype.trim) {
	/**
	 * String#trim() => string
	 * 前後の空白を除去した文字列を返す
	 * 
	 * 参考
	 * https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
	 */
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g,'');
	};
}


if (!Object.create) {
	/**
	 * Object.create(proto) => object
	 * 
	 * 参考
	 * http://www.slideshare.net/ferrantes/ecmascript-5-10575898
	 */
	Object.create = function(proto) {
		if (arguments.length > 1) {
			throw new Error('Object create implementation accepts the first parameter.');
		}
		function F() {};
		F.prototype = proto;
		return new F();
	}
}
if (!Object.keys) {
	/**
	 * Object.keys(obj) => Array
	 * 
	 * 参考
	 * https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
	 * http://www.slideshare.net/ferrantes/ecmascript-5-10575898 p100
	 */
	Object.keys = function(o) {
		if (o == null) {
			throw new TypeError('obj is null or undefined');
		}
		if (o !== Object(o)) {
			throw new TypeError('Object.keys called on non-object');
		}
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		var a = [];
		for (var k in o) {
			// 'hasOwnProperty'というプロパティを持っている可能性があるため
			// 直接hasOwnPropertyを呼び出すことを避ける
			if (hasOwnProperty.call(o, k)) {
				a.push(k);
			}
		}
		return a;
	};
}


if (!Function.prototype.bind) {
	/**
	 * Function#bind(obj, args...) => function
	 * 
	 * 参考
	 * http://www.slideshare.net/ferrantes/ecmascript-5-10575898 p133
	 */
	Function.prototype.bind = function() {
		var fn = this;
		var args = Array.prototype.slice.call(arguments);
		var obj = args.shift();
		
		return function() {
			return fn.apply(obj, args.concat(Array.prototype.slice.call(arguments)));
		};
	};
}


if (!Array.isArray) {
	/**
	 * Array.isArray(array) => boolean
	 * 
	 * 参考
	 * https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
	 */
	Array.isArray = function(array) {
		return Object.prototype.toString.call(array) === '[object Array]';
	};
}
if (!Array.prototype.indexOf) {
	/**
	 * Array#indexOf(needle) => number
	 * 
	 * 参考
	 * https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
	 */
	Array.prototype.indexOf = function(needle) {
		if (this == null) {
			throw new TypeError('this is null or undefined');
		}
		if (arguments.length === 0) {
			throw new TypeError('no needle');
		}
		var t = Object(this);  // [1]: Array以外の型にも適用可能にする
		var len = t.length >> 0;  // [2]: 整数として無効な値は0となる
		
		for (var i=0; i < len; i++) {
			if (i in t) {
				if (t[i] === needle) {
					return i;
				}
			}
		}
		return -1;
	};
}
if (!Array.prototype.lastIndexOf) {
	/**
	 * Array#lastIndexOf(needle) => number
	 */
	Array.prototype.lastIndexOf = function(needle) {
		if (this == null) {
			throw new TypeError('this is null or undefined');
		}
		if (arguments.length === 0) {
			throw new TypeError('no needle');
		}
		var t = Object(this);  // [1]
		var len = t.length >> 0;  // [2]
		
		for (var i=len-1; i >= 0; i--) {
			if (i in t) {
				if (t[i] === needle) {
					return i;
				}
			}
		}
		return -1;
	};
}
if (!Array.prototype.forEach) {
	/**
	 * Array#forEach(callback[, thisp])
	 */
	Array.prototype.forEach = function(callback, thisp) {
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
		var t = Object(this);  // [1]
		var len = t.length >> 0;  // [2]
		
		for (var i=0; i < len; i++) {
			if (i in t) {
				callback.call(thisp, t[i], i);
			}
		}
		// Why "forEach" method doesn't return "this" value?
	};
}
if (!Array.prototype.map) {
	/**
	 * Array#map(callback[, thisp]) => Array
	 */
	Array.prototype.map = function(callback, thisp) {
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
		var t = Object(this);  // [1]
		var len = t.length >> 0;  // [2]
		
		var a = [];
		for (var i=0; i < len; i++) {
			if (i in t) {
				a[i] = callback.call(thisp, t[i], i);
			}
		}
		return a;
	};
}
if (!Array.prototype.filter) {
	/**
	 * Array#filter(callback[, thisp]) => Array
	 * 
	 * 参考
	 * https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
	 */
	Array.prototype.filter = function(callback, thisp) {
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
		var t = Object(this);  // [1]
		var len = t.length >> 0;  // [2]
		
		var a = [];
		for (var i=0; i < len; i++) {
			if (i in t) {
				var e = t[i];
				if (callback.call(thisp, e, i, this)) {
					a.push(e);
				}
			}
		}
		return a;
	}
}
if (!Array.prototype.every) {
	/**
	 * Array#every(callback[, thisp]) => boolean
	 * 全要素に対してtester()がtrueを返すかチェックする
	 * 
	 * tester : function(element, index, array) => boolean
	 *   elementのテスト関数
	 * thisp : object
	 *   callback関数のthisとなるオブジェクト
	 *   省略可能
	 */
	Array.prototype.every = function(tester, thisp) {
		if (this == null) {
			throw new TypeError('this is null or undefined');
		}
		if (arguments.length === 0) {
			throw new TypeError('no tester');
		}
		if (typeof tester !== 'function') {
			throw new TypeError('tester is not a function');
		}
		thisp || (thisp = null);
		var t = Object(this);  // [1]
		var len = t.length >> 0;  // [2]
		
		for (var i=0; i < len; i++) {
			if (i in t) {
				if (!tester.call(thisp, t[i], i, this)) {
					return false;
				}
			}
		}
		return true;
	};
}
if (!Array.prototype.some) {
	/**
	 * Array#some(tester[, thisp]) => boolean
	 * tester()がtrueを返す要素が少なくとも1つあるかチェックする
	 * 
	 * tester : function(element, index, array) => boolean
	 *   elementのテスト関数
	 * thisp : object
	 *   callback関数のthisとなるオブジェクト
	 *   省略可能
	 */
	Array.prototype.some = function(tester, thisp) {
		if (this == null) {
			throw new TypeError('this is null or undefined');
		}
		if (arguments.length === 0) {
			throw new TypeError('no tester');
		}
		if (typeof tester !== 'function') {
			throw new TypeError('tester is not a function');
		}
		thisp || (thisp = null);
		var t = Object(this);  // [1]
		var len = t.length >> 0;  // [2]
		
		for (var i=0; i < len; i++) {
			if (i in t) {
				if (tester.call(thisp, t[i], i, this)) {
					return true;
				}
			}
		}
		return false;
	};
}
if (!Array.prototype.reduce) {
	/**
	 * Array#reduce(accumulator[, initialValue]) => any
	 * 
	 * accumulator : function(current, element, index, array) => any
	 *   currentとelementを演算した結果を戻り値として返す
	 *   
	 *   current : any
	 *     現在の値
	 *   element : any
	 *     配列のindex番目の要素
	 *   index : number
	 *     elementの添字
	 *   array
	 *     配列
	 * 
	 * initialValue : any
	 *   初期値
	 * 
	 * 参考
	 * https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
	 */
	Array.prototype.reduce = function(accumulator /*, initialValue */) {
		if (this == null) {
			throw new TypeError('this is null or undefined');
		}
		if (arguments.length === 0) {
			throw new TypeError('no acuumulator');
		}
		if (typeof accumulator !== 'function') {
			throw new TypeError('accumulator is not a function');
		}
		var t = Object(this);  // [1]
		var len = t.length >> 0;  // [2]
		var i = 0;
		var cur;
		if (arguments.length >= 2) {
			cur = arguments[1];
		} else {
			if (len === 0) {
				throw new Error('array length is 0 and no initial value');
			}
			while (true) {
				if (i in t) {
					cur = t[i++];
					break;
				}
				if (i >= l) {
					throw new Error('array contains no values and no initial value');
				}
			}
		}
		while (i < l) {
			if (i in t) {
				cur = accumulator.call(null, cur, t[i], i, this);
			}
			i++;
		}
		return cur;
	};
}
if (!Array.prototype.reduceRight) {
	/**
	 * Array#reduceRight(accumulator[, initialValue]) => any
	 * 
	 * accumulator : function(current, element, index, array) => any
	 *   currentとelementを演算した結果を戻り値として返す
	 *   
	 *   current : any
	 *     現在の値
	 *   element : any
	 *     配列のindex番目の要素
	 *   index : number
	 *     elementの添字
	 *   array
	 *     配列
	 * 
	 * initialValue : any
	 *   初期値
	 * 
	 * 参考
	 * https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight
	 */
	Array.prototype.reduceRight = function(accumulator /*, initialValue */) {
		if (this == null) {
			throw new TypeError('this == null');
		}
		if (arguments.length === 0) {
			throw new TypeError('no acuumulator');
		}
		if (typeof accumulator !== 'function') {
			throw new TypeError('accumulator is not a function');
		}
		var t = Object(this);  // [1]
		var len = t.length >> 0;  // [2]
		var i = len-1;
		var cur;
		if (arguments.length >= 2) {
			cur = arguments[1];
		} else {
			if (len === 0) {
				throw new Error('array length is 0 and no initial-value');
			}
			while (true) {
				if (i in t) {
					cur = t[i--];
					break;
				}
				if (--i < 0) {
					throw new TypeError('array contains no values and no initial value');
				}
			}
		}
		while (i >= 0) {
			if (i in t) {
				cur = accumulator.call(null, cur, t[i], i, this);
			}
			i--;
		}
		return cur;
	};
}


if (!Date.now) {
	Date.now = function() {
		return +new Date();
	};
}


// var JSON = {};
// JSON.stringify = function() {};
// JSON.parse = function() {};
// exports.JSON = JSON;
