/**
 * @file    ES5 ��Polyfill
 * @author  s_hiiragi (https://github.com/s-hiiragi)
 */

if (!String.prototype.trim) {
	/**
	 * String#trim() => string
	 * �O��̋󔒂����������������Ԃ�
	 * 
	 * �Q�l
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
	 * �Q�l
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
	 * �Q�l
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
			// 'hasOwnProperty'�Ƃ����v���p�e�B�������Ă���\�������邽��
			// ����hasOwnProperty���Ăяo�����Ƃ������
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
	 * �Q�l
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
	 * �Q�l
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
	 * �Q�l
	 * https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
	 */
	Array.prototype.indexOf = function(needle) {
		if (this == null) {
			throw new TypeError('this is null or undefined');
		}
		if (arguments.length === 0) {
			throw new TypeError('no needle');
		}
		var t = Object(this);  // [1]: Array�ȊO�̌^�ɂ��K�p�\�ɂ���
		var len = t.length >> 0;  // [2]: �����Ƃ��Ė����Ȓl��0�ƂȂ�
		
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
	 * �Q�l
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
	 * �S�v�f�ɑ΂���tester()��true��Ԃ����`�F�b�N����
	 * 
	 * tester : function(element, index, array) => boolean
	 *   element�̃e�X�g�֐�
	 * thisp : object
	 *   callback�֐���this�ƂȂ�I�u�W�F�N�g
	 *   �ȗ��\
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
	 * tester()��true��Ԃ��v�f�����Ȃ��Ƃ�1���邩�`�F�b�N����
	 * 
	 * tester : function(element, index, array) => boolean
	 *   element�̃e�X�g�֐�
	 * thisp : object
	 *   callback�֐���this�ƂȂ�I�u�W�F�N�g
	 *   �ȗ��\
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
	 *   current��element�����Z�������ʂ�߂�l�Ƃ��ĕԂ�
	 *   
	 *   current : any
	 *     ���݂̒l
	 *   element : any
	 *     �z���index�Ԗڂ̗v�f
	 *   index : number
	 *     element�̓Y��
	 *   array
	 *     �z��
	 * 
	 * initialValue : any
	 *   �����l
	 * 
	 * �Q�l
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
	 *   current��element�����Z�������ʂ�߂�l�Ƃ��ĕԂ�
	 *   
	 *   current : any
	 *     ���݂̒l
	 *   element : any
	 *     �z���index�Ԗڂ̗v�f
	 *   index : number
	 *     element�̓Y��
	 *   array
	 *     �z��
	 * 
	 * initialValue : any
	 *   �����l
	 * 
	 * �Q�l
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
