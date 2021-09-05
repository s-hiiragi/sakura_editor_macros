/**
 * @file    JavaScript����@�\�̊g��
 * @author  s_hiiragi (https://github.com/s-hiiragi)
 */

load('commons/es5.js');

// Array �W�F�l���b�N���\�b�h
// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array#Array_generic_methods
(function () {
	'use strict';
	
	var i,
		// ���L�̕��@�� array �̃��\�b�h���\�z���邱�Ƃ��\�ł����A
		//   getOwnPropertyNames() ���\�b�h�̓V����K�p�ł��܂���:
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
 * ��O�N���X�𐶐�����
 * 
 * name : string
 *   ��O�N���X��
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
				// new makeError(name)(message)�ƋL�q�o����悤�ɂ���n�b�N
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
 * '"'�Ŋ������������Ԃ�
 * 
 * �Q�l
 * https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/quote
 */
String.prototype.quote = function() {
	return '"' + this.replace(/[\\"]/, '\\$&') + '"';  //'
};
/**
 * String#starts(str) => boolean
 * ������̐擪��str�����邩�`�F�b�N
 * 
 * str : string
 *   �擪�ɂ���ׂ�������
 * 
 * ���l
 *   ES6 Harmony��String#startsWith()�Ƌ@�\���d������
 */
String.prototype.starts = function(str) { // imported from Java (String#starts)
	return this.indexOf(str) != -1;
};
/**
 * String#ends(str) => boolean
 * ������̖�����str�����邩�`�F�b�N
 * 
 * str : string
 *   �����ɂ���ׂ�������
 * 
 * ���l
 *   ES6 Harmony��String#endsWith()�Ƌ@�\���d������
 */
String.prototype.ends = function(str) { // imported from Java (String#ends)
	return this.lastIndexOf(str) == this.length-str.length;
};
/**
 * String#trimLeft() => string [ES Harmony]
 * 
 * �Q�l
 * https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/TrimLeft
 */
String.prototype.trimLeft = function() {
	return this.replace(/^\s+/, '');
};
/**
 * String#trimRight() => string [ES Harmony]
 * 
 * �Q�l
 * https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/TrimRight
 */
String.prototype.trimRight = function() {
	return this.replace(/\s+$/, '');
};


/**
 * Object#keys() => Array
 * Object.keys()�̃��\�b�h��
 * 
 * Object���g�����v���p�e�B�̖��O�̔z���Ԃ�
 * ��) Object���g��"keys"�Ƃ������O�̃v���p�e�B�����ꍇ��Object.keys()���g�p
 *     ���邱�ƁB
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
 * Object���g�����v���p�e�B�̒l�̔z���Ԃ�
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
 * �I�u�W�F�N�g�̊e�L�[�ɑ΂��ď���������
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
 *   �v�f���ƂɌĂяo�����R�[���o�b�N�֐�
 *   false��Ԃ���each()���I������B
 * 
 * thisp : object
 *   �R�[���o�b�N�֐���this�l
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
	var t = Object(this);  // Array�ȊO�̌^�ɂ��K�p�\�ɂ���
	var len = t.length >> 0;  // �����Ƃ��Ė����Ȓl��0�ƂȂ�
	
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
	// TODO description��message�Ƃǂ��Ⴄ�H
	return this.name + ': ' + this.message;
};
