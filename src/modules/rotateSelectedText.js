// exported items
// - rotateSelectedText()
// - rotationRules object
// - rotateString()

/**
 * rotateSelectedText
 *
 * @param {number} offset  numbers of rotation (+N: forward, -N: back)
 */
function rotateSelectedText(offset) {
	if (Editor.IsTextSelected() == 0) return;

	var text = Editor.GetSelectedString(0/* = RESERVED*/);

	var result = rotateString(text, offset);
	if (result === text) return;

	Editor.InsText(result);

	for (var i = 0; i < result.length; i++)
		Editor.Left();

	Editor.BeginSelect();

	for (var i = 0; i < result.length; i++)
		Editor.Right_Sel();
}

var rotationRules = [
	{
		regexp: /-?\d+/g,
		replacer: function(s) {
			Editor.TraceOut(this.offset);
			return String(Number(s) + this.offset);
		}
	},
	{
		_table: ['ŒŽ', '‰Î', '…', '–Ø', '‹à', '“y', '“ú'],
		regexp: /[ŒŽ‰Î…–Ø‹à“y“ú]/g,
		replacer: function(s) {
			var i = this._table.indexOf(s);
			if (i < 0) return s;
			return this._table[(7 + i + this.offset) % 7];
		}
	},
	{
		regexp: /(\d{4})([-\/.])(\d{1,2})([-\/.])(\d{1,2})/g,
		replacer: function(s, year, s1, month, s2, date) {
			var dt = new Date(Number(y), Number(m) - 1, Number(d) + this.offset);
			var y = String(dt.getFullYear());
			var m = (month.charAt(0) == '0' ? '0' : '') + String(dt.getMonth() + 1);
			var d = (date.charAt(0) == '0' ? '0' : '') + String(dt.getDate());
			return y + s1 + m + s2 + d;
		}
	}
];

/**
 * rotateString
 *
 * @param {string} str     string containing words to be able to rotate
 * @param {number} offset  numbers of rotation (+N: forward, -N: back)
 *
 * @return {string} input string or rotated string
 */
function rotateString(str, offset) {
	var matched = false;
	var result;
	for (var i = 0; i < rotationRules.length; i++) {
		var ctor = function(){};
		ctor.prototype = rotationRules[i];
		var rule = new ctor();  // avoid overwrite

		rule.offset = offset;
		result = str.replace(rule.regexp, function() {
			return rule.replacer.apply(rule, arguments);
		});
		if (result !== str) {
			matched = true;
			break;
		}
	}

	return matched ? result : str;
}
