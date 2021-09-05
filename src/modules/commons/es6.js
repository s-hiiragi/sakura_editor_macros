/**
 * @file     ECMAScript 6 Harmony ‚ÌPolyfill
 * @author   s_hiiragi (https://github.com/s-hiiragi)
 */

// 
// String#startsWith(str[, position]) => string [ES6 Harmony]
// 

// 
// String#endsWith(str[, position]) => string [ES6 Harmony]
// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
// 

// String#contains()

/**
 * String#repeat()
 * 
 * ŽQl
 * http://wiki.ecmascript.org/doku.php?id=harmony:string.prototype.repeat
 */
if (!String.prototype.repeat) {
	String.prototype.repeat = function(count) {
		return new Array((count >> 0) + 1).join('' + this);
	};
}
