/**
 * @name         assert.js
 * @description  <sakura-macro>/modules/commons/assert.js
 * @author       s_hiiragi (https://github.com/s-hiiragi)
 * @updated      2013/10/13 10:08:52 JST
 */

function assert_println(caller_name, user_msg, description) {
	print(caller_name);
	print((user_msg || '') + '\r\n  ');
	println(description);
}

var assert = {};

/**
 * assert.equal(actual, expected, message)
 * actualとexpectedが等しいかチェックする
 * 
 * actual !== expectedのとき失敗する。
 */
assert.equal = function(actual, expected, message) {
	if (actual !== expected) {
		assert_println('assert.equal: ', message, actual + ' != ' + expected);
	}
};

/**
 * assert.throws(fn, error, message)
 * fn()で例外errorが発生するかチェックする
 * 
 * error以外の例外が発生した場合失敗する。
 * 例外が発生しない場合失敗する。
 */
assert.throws = function(fn, error, message) {
	try {
		fn();
	} catch (ex) {
		if (ex.name !== error.name) {
			assert_println('assert.throws: ', message, ex.name + ' was thrown.');
		}
	}
	assert_println('assert.throws: ', message, 'This function don\'t be thrown an exception.');
};

exports.assert = assert;
