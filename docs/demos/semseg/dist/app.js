(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.al.W === region.as.W)
	{
		return 'on line ' + region.al.W;
	}
	return 'on lines ' + region.al.W + ' through ' + region.as.W;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.bi,
		impl.bx,
		impl.bv,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS
//
// For some reason, tabs can appear in href protocols and it still works.
// So '\tjava\tSCRIPT:alert("!!!")' and 'javascript:alert("!!!")' are the same
// in practice. That is why _VirtualDom_RE_js and _VirtualDom_RE_js_html look
// so freaky.
//
// Pulling the regular expressions out to the top level gives a slight speed
// boost in small benchmarks (4-10%) but hoisting values to reduce allocation
// can be unpredictable in large programs where JIT may have a harder time with
// functions are not fully self-contained. The benefit is more that the js and
// js_html ones are so weird that I prefer to see them near each other.


var _VirtualDom_RE_script = /^script$/i;
var _VirtualDom_RE_on_formAction = /^(on|formAction$)/i;
var _VirtualDom_RE_js = /^\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/i;
var _VirtualDom_RE_js_html = /^\s*(j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:|d\s*a\s*t\s*a\s*:\s*t\s*e\s*x\s*t\s*\/\s*h\s*t\s*m\s*l\s*(,|;))/i;


function _VirtualDom_noScript(tag)
{
	return _VirtualDom_RE_script.test(tag) ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return _VirtualDom_RE_on_formAction.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return _VirtualDom_RE_js.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return _VirtualDom_RE_js_html.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlJson(value)
{
	return (typeof _Json_unwrap(value) === 'string' && _VirtualDom_RE_js_html.test(_Json_unwrap(value)))
		? _Json_wrap(
			/**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		) : value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		A: func(record.A),
		am: record.am,
		aj: record.aj
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.A;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.am;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.aj) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.bi,
		impl.bx,
		impl.bv,
		function(sendToApp, initialModel) {
			var view = impl.by;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.bi,
		impl.bx,
		impl.bv,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.ak && impl.ak(sendToApp)
			var view = impl.by;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.ap);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.bw) && (_VirtualDom_doc.title = title = doc.bw);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.bl;
	var onUrlRequest = impl.bm;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		ak: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.aN === next.aN
							&& curr.af === next.af
							&& curr.aK.a === next.aK.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		bi: function(flags)
		{
			return A3(impl.bi, flags, _Browser_getUrl(), key);
		},
		by: impl.by,
		bx: impl.bx,
		bv: impl.bv
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { bf: 'hidden', D: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { bf: 'mozHidden', D: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { bf: 'msHidden', D: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { bf: 'webkitHidden', D: 'webkitvisibilitychange' }
		: { bf: 'hidden', D: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		aU: _Browser_getScene(),
		a2: {
			a4: _Browser_window.pageXOffset,
			a5: _Browser_window.pageYOffset,
			a3: _Browser_doc.documentElement.clientWidth,
			az: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		a3: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		az: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			aU: {
				a3: node.scrollWidth,
				az: node.scrollHeight
			},
			a2: {
				a4: node.scrollLeft,
				a5: node.scrollTop,
				a3: node.clientWidth,
				az: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			aU: _Browser_getScene(),
			a2: {
				a4: x,
				a5: y,
				a3: _Browser_doc.documentElement.clientWidth,
				az: _Browser_doc.documentElement.clientHeight
			},
			bd: {
				a4: x + rect.left,
				a5: y + rect.top,
				a3: rect.width,
				az: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});



function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}



// SEND REQUEST

var _Http_toTask = F3(function(router, toTask, request)
{
	return _Scheduler_binding(function(callback)
	{
		function done(response) {
			callback(toTask(request.ae.a(response)));
		}

		var xhr = new XMLHttpRequest();
		xhr.addEventListener('error', function() { done($elm$http$Http$NetworkError_); });
		xhr.addEventListener('timeout', function() { done($elm$http$Http$Timeout_); });
		xhr.addEventListener('load', function() { done(_Http_toResponse(request.ae.b, xhr)); });
		$elm$core$Maybe$isJust(request.a$) && _Http_track(router, xhr, request.a$.a);

		try {
			xhr.open(request.aF, request.a1, true);
		} catch (e) {
			return done($elm$http$Http$BadUrl_(request.a1));
		}

		_Http_configureRequest(xhr, request);

		request.ap.a && xhr.setRequestHeader('Content-Type', request.ap.a);
		xhr.send(request.ap.b);

		return function() { xhr.c = true; xhr.abort(); };
	});
});


// CONFIGURE

function _Http_configureRequest(xhr, request)
{
	for (var headers = request.ay; headers.b; headers = headers.b) // WHILE_CONS
	{
		xhr.setRequestHeader(headers.a.a, headers.a.b);
	}
	xhr.timeout = request.a_.a || 0;
	xhr.responseType = request.ae.d;
	xhr.withCredentials = request.a7;
}


// RESPONSES

function _Http_toResponse(toBody, xhr)
{
	return A2(
		200 <= xhr.status && xhr.status < 300 ? $elm$http$Http$GoodStatus_ : $elm$http$Http$BadStatus_,
		_Http_toMetadata(xhr),
		toBody(xhr.response)
	);
}


// METADATA

function _Http_toMetadata(xhr)
{
	return {
		a1: xhr.responseURL,
		bt: xhr.status,
		bu: xhr.statusText,
		ay: _Http_parseHeaders(xhr.getAllResponseHeaders())
	};
}


// HEADERS

function _Http_parseHeaders(rawHeaders)
{
	if (!rawHeaders)
	{
		return $elm$core$Dict$empty;
	}

	var headers = $elm$core$Dict$empty;
	var headerPairs = rawHeaders.split('\r\n');
	for (var i = headerPairs.length; i--; )
	{
		var headerPair = headerPairs[i];
		var index = headerPair.indexOf(': ');
		if (index > 0)
		{
			var key = headerPair.substring(0, index);
			var value = headerPair.substring(index + 2);

			headers = A3($elm$core$Dict$update, key, function(oldValue) {
				return $elm$core$Maybe$Just($elm$core$Maybe$isJust(oldValue)
					? value + ', ' + oldValue.a
					: value
				);
			}, headers);
		}
	}
	return headers;
}


// EXPECT

var _Http_expect = F3(function(type, toBody, toValue)
{
	return {
		$: 0,
		d: type,
		b: toBody,
		a: toValue
	};
});

var _Http_mapExpect = F2(function(func, expect)
{
	return {
		$: 0,
		d: expect.d,
		b: expect.b,
		a: function(x) { return func(expect.a(x)); }
	};
});

function _Http_toDataView(arrayBuffer)
{
	return new DataView(arrayBuffer);
}


// BODY and PARTS

var _Http_emptyBody = { $: 0 };
var _Http_pair = F2(function(a, b) { return { $: 0, a: a, b: b }; });

function _Http_toFormData(parts)
{
	for (var formData = new FormData(); parts.b; parts = parts.b) // WHILE_CONS
	{
		var part = parts.a;
		formData.append(part.a, part.b);
	}
	return formData;
}

var _Http_bytesToBlob = F2(function(mime, bytes)
{
	return new Blob([bytes], { type: mime });
});


// PROGRESS

function _Http_track(router, xhr, tracker)
{
	// TODO check out lengthComputable on loadstart event

	xhr.upload.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Sending({
			bs: event.loaded,
			aW: event.total
		}))));
	});
	xhr.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Receiving({
			bp: event.loaded,
			aW: event.lengthComputable ? $elm$core$Maybe$Just(event.total) : $elm$core$Maybe$Nothing
		}))));
	});
}



// STRINGS


var _Parser_isSubString = F5(function(smallString, offset, row, col, bigString)
{
	var smallLength = smallString.length;
	var isGood = offset + smallLength <= bigString.length;

	for (var i = 0; isGood && i < smallLength; )
	{
		var code = bigString.charCodeAt(offset);
		isGood =
			smallString[i++] === bigString[offset++]
			&& (
				code === 0x000A /* \n */
					? ( row++, col=1 )
					: ( col++, (code & 0xF800) === 0xD800 ? smallString[i++] === bigString[offset++] : 1 )
			)
	}

	return _Utils_Tuple3(isGood ? offset : -1, row, col);
});



// CHARS


var _Parser_isSubChar = F3(function(predicate, offset, string)
{
	return (
		string.length <= offset
			? -1
			:
		(string.charCodeAt(offset) & 0xF800) === 0xD800
			? (predicate(_Utils_chr(string.substr(offset, 2))) ? offset + 2 : -1)
			:
		(predicate(_Utils_chr(string[offset]))
			? ((string[offset] === '\n') ? -2 : (offset + 1))
			: -1
		)
	);
});


var _Parser_isAsciiCode = F3(function(code, offset, string)
{
	return string.charCodeAt(offset) === code;
});



// NUMBERS


var _Parser_chompBase10 = F2(function(offset, string)
{
	for (; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (code < 0x30 || 0x39 < code)
		{
			return offset;
		}
	}
	return offset;
});


var _Parser_consumeBase = F3(function(base, offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var digit = string.charCodeAt(offset) - 0x30;
		if (digit < 0 || base <= digit) break;
		total = base * total + digit;
	}
	return _Utils_Tuple2(offset, total);
});


var _Parser_consumeBase16 = F2(function(offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (0x30 <= code && code <= 0x39)
		{
			total = 16 * total + code - 0x30;
		}
		else if (0x41 <= code && code <= 0x46)
		{
			total = 16 * total + code - 55;
		}
		else if (0x61 <= code && code <= 0x66)
		{
			total = 16 * total + code - 87;
		}
		else
		{
			break;
		}
	}
	return _Utils_Tuple2(offset, total);
});



// FIND STRING


var _Parser_findSubString = F5(function(smallString, offset, row, col, bigString)
{
	var newOffset = bigString.indexOf(smallString, offset);
	var target = newOffset < 0 ? bigString.length : newOffset + smallString.length;

	while (offset < target)
	{
		var code = bigString.charCodeAt(offset++);
		code === 0x000A /* \n */
			? ( col=1, row++ )
			: ( col++, (code & 0xF800) === 0xD800 && offset++ )
	}

	return _Utils_Tuple3(newOffset, row, col);
});


function _Url_percentEncode(string)
{
	return encodeURIComponent(string);
}

function _Url_percentDecode(string)
{
	try
	{
		return $elm$core$Maybe$Just(decodeURIComponent(string));
	}
	catch (e)
	{
		return $elm$core$Maybe$Nothing;
	}
}


// DECODER

var _File_decoder = _Json_decodePrim(function(value) {
	// NOTE: checks if `File` exists in case this is run on node
	return (typeof File !== 'undefined' && value instanceof File)
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FILE', value);
});


// METADATA

function _File_name(file) { return file.name; }
function _File_mime(file) { return file.type; }
function _File_size(file) { return file.size; }

function _File_lastModified(file)
{
	return $elm$time$Time$millisToPosix(file.lastModified);
}


// DOWNLOAD

var _File_downloadNode;

function _File_getDownloadNode()
{
	return _File_downloadNode || (_File_downloadNode = document.createElement('a'));
}

var _File_download = F3(function(name, mime, content)
{
	return _Scheduler_binding(function(callback)
	{
		var blob = new Blob([content], {type: mime});

		// for IE10+
		if (navigator.msSaveOrOpenBlob)
		{
			navigator.msSaveOrOpenBlob(blob, name);
			return;
		}

		// for HTML5
		var node = _File_getDownloadNode();
		var objectUrl = URL.createObjectURL(blob);
		node.href = objectUrl;
		node.download = name;
		_File_click(node);
		URL.revokeObjectURL(objectUrl);
	});
});

function _File_downloadUrl(href)
{
	return _Scheduler_binding(function(callback)
	{
		var node = _File_getDownloadNode();
		node.href = href;
		node.download = '';
		node.origin === location.origin || (node.target = '_blank');
		_File_click(node);
	});
}


// IE COMPATIBILITY

function _File_makeBytesSafeForInternetExplorer(bytes)
{
	// only needed by IE10 and IE11 to fix https://github.com/elm/file/issues/10
	// all other browsers can just run `new Blob([bytes])` directly with no problem
	//
	return new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
}

function _File_click(node)
{
	// only needed by IE10 and IE11 to fix https://github.com/elm/file/issues/11
	// all other browsers have MouseEvent and do not need this conditional stuff
	//
	if (typeof MouseEvent === 'function')
	{
		node.dispatchEvent(new MouseEvent('click'));
	}
	else
	{
		var event = document.createEvent('MouseEvents');
		event.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		document.body.appendChild(node);
		node.dispatchEvent(event);
		document.body.removeChild(node);
	}
}


// UPLOAD

var _File_node;

function _File_uploadOne(mimes)
{
	return _Scheduler_binding(function(callback)
	{
		_File_node = document.createElement('input');
		_File_node.type = 'file';
		_File_node.accept = A2($elm$core$String$join, ',', mimes);
		_File_node.addEventListener('change', function(event)
		{
			callback(_Scheduler_succeed(event.target.files[0]));
		});
		_File_click(_File_node);
	});
}

function _File_uploadOneOrMore(mimes)
{
	return _Scheduler_binding(function(callback)
	{
		_File_node = document.createElement('input');
		_File_node.type = 'file';
		_File_node.multiple = true;
		_File_node.accept = A2($elm$core$String$join, ',', mimes);
		_File_node.addEventListener('change', function(event)
		{
			var elmFiles = _List_fromArray(event.target.files);
			callback(_Scheduler_succeed(_Utils_Tuple2(elmFiles.a, elmFiles.b)));
		});
		_File_click(_File_node);
	});
}


// CONTENT

function _File_toString(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(reader.result));
		});
		reader.readAsText(blob);
		return function() { reader.abort(); };
	});
}

function _File_toBytes(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(new DataView(reader.result)));
		});
		reader.readAsArrayBuffer(blob);
		return function() { reader.abort(); };
	});
}

function _File_toUrl(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(reader.result));
		});
		reader.readAsDataURL(blob);
		return function() { reader.abort(); };
	});
}

var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.e) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.g),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.g);
		} else {
			var treeLen = builder.e * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.i) : builder.i;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.e);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.g) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.g);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{i: nodeList, e: (len / $elm$core$Array$branchFactor) | 0, g: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {ax: fragment, af: host, aI: path, aK: port_, aN: protocol, aO: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$application = _Browser_application;
var $author$project$Requests$Initial = {$: 0};
var $author$project$Semseg$SetUrl = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (!maybeValue.$) {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Set$Set_elm_builtin = $elm$core$Basics$identity;
var $elm$core$Set$empty = $elm$core$Dict$empty;
var $elm$random$Random$Generate = $elm$core$Basics$identity;
var $elm$random$Random$Seed = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$random$Random$next = function (_v0) {
	var state0 = _v0.a;
	var incr = _v0.b;
	return A2($elm$random$Random$Seed, ((state0 * 1664525) + incr) >>> 0, incr);
};
var $elm$random$Random$initialSeed = function (x) {
	var _v0 = $elm$random$Random$next(
		A2($elm$random$Random$Seed, 0, 1013904223));
	var state1 = _v0.a;
	var incr = _v0.b;
	var state2 = (state1 + x) >>> 0;
	return $elm$random$Random$next(
		A2($elm$random$Random$Seed, state2, incr));
};
var $elm$time$Time$Name = function (a) {
	return {$: 0, a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 1, a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$Posix = $elm$core$Basics$identity;
var $elm$time$Time$millisToPosix = $elm$core$Basics$identity;
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0;
	return millis;
};
var $elm$random$Random$init = A2(
	$elm$core$Task$andThen,
	function (time) {
		return $elm$core$Task$succeed(
			$elm$random$Random$initialSeed(
				$elm$time$Time$posixToMillis(time)));
	},
	$elm$time$Time$now);
var $elm$random$Random$step = F2(
	function (_v0, seed) {
		var generator = _v0;
		return generator(seed);
	});
var $elm$random$Random$onEffects = F3(
	function (router, commands, seed) {
		if (!commands.b) {
			return $elm$core$Task$succeed(seed);
		} else {
			var generator = commands.a;
			var rest = commands.b;
			var _v1 = A2($elm$random$Random$step, generator, seed);
			var value = _v1.a;
			var newSeed = _v1.b;
			return A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$random$Random$onEffects, router, rest, newSeed);
				},
				A2($elm$core$Platform$sendToApp, router, value));
		}
	});
var $elm$random$Random$onSelfMsg = F3(
	function (_v0, _v1, seed) {
		return $elm$core$Task$succeed(seed);
	});
var $elm$random$Random$Generator = $elm$core$Basics$identity;
var $elm$random$Random$map = F2(
	function (func, _v0) {
		var genA = _v0;
		return function (seed0) {
			var _v1 = genA(seed0);
			var a = _v1.a;
			var seed1 = _v1.b;
			return _Utils_Tuple2(
				func(a),
				seed1);
		};
	});
var $elm$random$Random$cmdMap = F2(
	function (func, _v0) {
		var generator = _v0;
		return A2($elm$random$Random$map, func, generator);
	});
_Platform_effectManagers['Random'] = _Platform_createManager($elm$random$Random$init, $elm$random$Random$onEffects, $elm$random$Random$onSelfMsg, $elm$random$Random$cmdMap);
var $elm$random$Random$command = _Platform_leaf('Random');
var $elm$random$Random$generate = F2(
	function (tagger, generator) {
		return $elm$random$Random$command(
			A2($elm$random$Random$map, tagger, generator));
	});
var $author$project$Semseg$GotExample = F2(
	function (a, b) {
		return {$: 10, a: a, b: b};
	});
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$fail = _Json_fail;
var $author$project$Gradio$decodeOneHelper = function (maybe) {
	if (!maybe.$) {
		var something = maybe.a;
		return $elm$json$Json$Decode$succeed(something);
	} else {
		return $elm$json$Json$Decode$fail('No result');
	}
};
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$json$Json$Decode$list = _Json_decodeList;
var $author$project$Gradio$decodeOne = function (decoder) {
	return A2(
		$elm$json$Json$Decode$andThen,
		$author$project$Gradio$decodeOneHelper,
		A2(
			$elm$json$Json$Decode$map,
			$elm$core$List$head,
			$elm$json$Json$Decode$list(decoder)));
};
var $author$project$Semseg$Example = F3(
	function (image, labels, classes) {
		return {ac: classes, h: image, N: labels};
	});
var $author$project$Gradio$Base64Image = $elm$core$Basics$identity;
var $author$project$Gradio$base64Image = function (str) {
	return A2($elm$core$String$startsWith, 'data:image/', str) ? $elm$core$Maybe$Just(str) : $elm$core$Maybe$Nothing;
};
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Gradio$base64ImageDecoder = A2(
	$elm$json$Json$Decode$andThen,
	function (str) {
		var _v0 = $author$project$Gradio$base64Image(str);
		if (!_v0.$) {
			var img = _v0.a;
			return $elm$json$Json$Decode$succeed(img);
		} else {
			return $elm$json$Json$Decode$fail('Invalid base64 image format');
		}
	},
	$elm$json$Json$Decode$string);
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0;
		return A3($elm$core$Dict$insert, key, 0, dict);
	});
var $elm$core$Set$fromList = function (list) {
	return A3($elm$core$List$foldl, $elm$core$Set$insert, $elm$core$Set$empty, list);
};
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$json$Json$Decode$map3 = _Json_map3;
var $author$project$Semseg$exampleDecoder = A4(
	$elm$json$Json$Decode$map3,
	$author$project$Semseg$Example,
	A2($elm$json$Json$Decode$field, 'orig_url', $author$project$Gradio$base64ImageDecoder),
	A2($elm$json$Json$Decode$field, 'seg_url', $author$project$Gradio$base64ImageDecoder),
	A2(
		$elm$json$Json$Decode$field,
		'classes',
		A2(
			$elm$json$Json$Decode$map,
			$elm$core$Set$fromList,
			$elm$json$Json$Decode$list($elm$json$Json$Decode$int))));
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$core$Task$onError = _Scheduler_onError;
var $elm$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return $elm$core$Task$command(
			A2(
				$elm$core$Task$onError,
				A2(
					$elm$core$Basics$composeL,
					A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
					$elm$core$Result$Err),
				A2(
					$elm$core$Task$andThen,
					A2(
						$elm$core$Basics$composeL,
						A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
						$elm$core$Result$Ok),
					task)));
	});
var $elm$core$Result$andThen = F2(
	function (callback, result) {
		if (!result.$) {
			var value = result.a;
			return callback(value);
		} else {
			var msg = result.a;
			return $elm$core$Result$Err(msg);
		}
	});
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$url$Url$Builder$toQueryPair = function (_v0) {
	var key = _v0.a;
	var value = _v0.b;
	return key + ('=' + value);
};
var $elm$url$Url$Builder$toQuery = function (parameters) {
	if (!parameters.b) {
		return '';
	} else {
		return '?' + A2(
			$elm$core$String$join,
			'&',
			A2($elm$core$List$map, $elm$url$Url$Builder$toQueryPair, parameters));
	}
};
var $elm$url$Url$Builder$crossOrigin = F3(
	function (prePath, pathSegments, parameters) {
		return prePath + ('/' + (A2($elm$core$String$join, '/', pathSegments) + $elm$url$Url$Builder$toQuery(parameters)));
	});
var $elm$http$Http$BadStatus_ = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$http$Http$BadUrl_ = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$GoodStatus_ = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $elm$http$Http$NetworkError_ = {$: 2};
var $elm$http$Http$Receiving = function (a) {
	return {$: 1, a: a};
};
var $elm$http$Http$Sending = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$Timeout_ = {$: 1};
var $elm$core$Maybe$isJust = function (maybe) {
	if (!maybe.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === -1) && (dict.d.$ === -1)) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === -1) && (dict.d.$ === -1)) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a)) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === -1) {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === -1) {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === -1) {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (!_v0.$) {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $elm$http$Http$emptyBody = _Http_emptyBody;
var $author$project$Gradio$ApiError = function (a) {
	return {$: 3, a: a};
};
var $author$project$Gradio$NetworkError = function (a) {
	return {$: 0, a: a};
};
var $author$project$Gradio$httpResolver = function (response) {
	switch (response.$) {
		case 4:
			var body = response.b;
			return $elm$core$Result$Ok(body);
		case 0:
			var url = response.a;
			return $elm$core$Result$Err(
				$author$project$Gradio$ApiError('Bad URL: ' + url));
		case 1:
			return $elm$core$Result$Err(
				$author$project$Gradio$NetworkError('Timed out'));
		case 2:
			return $elm$core$Result$Err(
				$author$project$Gradio$NetworkError('Unknown network error'));
		default:
			var body = response.b;
			return $elm$core$Result$Err(
				$author$project$Gradio$ApiError(body));
	}
};
var $author$project$Gradio$JsonError = function (a) {
	return {$: 2, a: a};
};
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (!result.$) {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $author$project$Gradio$jsonResolver = F2(
	function (decoder, body) {
		return A2(
			$elm$core$Result$mapError,
			A2($elm$core$Basics$composeR, $elm$json$Json$Decode$errorToString, $author$project$Gradio$JsonError),
			A2($elm$json$Json$Decode$decodeString, decoder, body));
	});
var $author$project$Gradio$ParsingError = function (a) {
	return {$: 1, a: a};
};
var $elm$core$String$concat = function (strings) {
	return A2($elm$core$String$join, '', strings);
};
var $author$project$Gradio$problemToString = function (p) {
	switch (p.$) {
		case 0:
			var s = p.a;
			return 'expecting \'' + (s + '\'');
		case 1:
			return 'expecting int';
		case 2:
			return 'expecting hex';
		case 3:
			return 'expecting octal';
		case 4:
			return 'expecting binary';
		case 5:
			return 'expecting float';
		case 6:
			return 'expecting number';
		case 7:
			return 'expecting variable';
		case 8:
			var s = p.a;
			return 'expecting symbol \'' + (s + '\'');
		case 9:
			var s = p.a;
			return 'expecting keyword \'' + (s + '\'');
		case 10:
			return 'expecting end';
		case 11:
			return 'unexpected char';
		case 12:
			var s = p.a;
			return 'problem ' + s;
		default:
			return 'bad repeat';
	}
};
var $author$project$Gradio$deadEndToString = function (deadend) {
	return $author$project$Gradio$problemToString(deadend.bo) + (' at row ' + ($elm$core$String$fromInt(deadend.br) + (', col ' + $elm$core$String$fromInt(deadend.a9))));
};
var $elm$core$List$intersperse = F2(
	function (sep, xs) {
		if (!xs.b) {
			return _List_Nil;
		} else {
			var hd = xs.a;
			var tl = xs.b;
			var step = F2(
				function (x, rest) {
					return A2(
						$elm$core$List$cons,
						sep,
						A2($elm$core$List$cons, x, rest));
				});
			var spersed = A3($elm$core$List$foldr, step, _List_Nil, tl);
			return A2($elm$core$List$cons, hd, spersed);
		}
	});
var $author$project$Gradio$deadEndsToString = function (deadEnds) {
	return $elm$core$String$concat(
		A2(
			$elm$core$List$intersperse,
			'; ',
			A2($elm$core$List$map, $author$project$Gradio$deadEndToString, deadEnds)));
};
var $elm$parser$Parser$Done = function (a) {
	return {$: 1, a: a};
};
var $elm$parser$Parser$Loop = function (a) {
	return {$: 0, a: a};
};
var $elm$parser$Parser$ExpectingEnd = {$: 10};
var $elm$parser$Parser$Advanced$Bad = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$Good = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$parser$Parser$Advanced$Parser = $elm$core$Basics$identity;
var $elm$parser$Parser$Advanced$AddRight = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$DeadEnd = F4(
	function (row, col, problem, contextStack) {
		return {a9: col, ba: contextStack, bo: problem, br: row};
	});
var $elm$parser$Parser$Advanced$Empty = {$: 0};
var $elm$parser$Parser$Advanced$fromState = F2(
	function (s, x) {
		return A2(
			$elm$parser$Parser$Advanced$AddRight,
			$elm$parser$Parser$Advanced$Empty,
			A4($elm$parser$Parser$Advanced$DeadEnd, s.br, s.a9, x, s.c));
	});
var $elm$parser$Parser$Advanced$end = function (x) {
	return function (s) {
		return _Utils_eq(
			$elm$core$String$length(s.a),
			s.b) ? A3($elm$parser$Parser$Advanced$Good, false, 0, s) : A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, x));
	};
};
var $elm$parser$Parser$end = $elm$parser$Parser$Advanced$end($elm$parser$Parser$ExpectingEnd);
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $elm$parser$Parser$Advanced$map2 = F3(
	function (func, _v0, _v1) {
		var parseA = _v0;
		var parseB = _v1;
		return function (s0) {
			var _v2 = parseA(s0);
			if (_v2.$ === 1) {
				var p = _v2.a;
				var x = _v2.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p1 = _v2.a;
				var a = _v2.b;
				var s1 = _v2.c;
				var _v3 = parseB(s1);
				if (_v3.$ === 1) {
					var p2 = _v3.a;
					var x = _v3.b;
					return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
				} else {
					var p2 = _v3.a;
					var b = _v3.b;
					var s2 = _v3.c;
					return A3(
						$elm$parser$Parser$Advanced$Good,
						p1 || p2,
						A2(func, a, b),
						s2);
				}
			}
		};
	});
var $elm$parser$Parser$Advanced$ignorer = F2(
	function (keepParser, ignoreParser) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$always, keepParser, ignoreParser);
	});
var $elm$parser$Parser$ignorer = $elm$parser$Parser$Advanced$ignorer;
var $elm$parser$Parser$Advanced$keeper = F2(
	function (parseFunc, parseArg) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$apL, parseFunc, parseArg);
	});
var $elm$parser$Parser$keeper = $elm$parser$Parser$Advanced$keeper;
var $elm$parser$Parser$ExpectingKeyword = function (a) {
	return {$: 9, a: a};
};
var $elm$parser$Parser$Advanced$Token = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$isSubChar = _Parser_isSubChar;
var $elm$parser$Parser$Advanced$isSubString = _Parser_isSubString;
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$Basics$not = _Basics_not;
var $elm$parser$Parser$Advanced$keyword = function (_v0) {
	var kwd = _v0.a;
	var expecting = _v0.b;
	var progress = !$elm$core$String$isEmpty(kwd);
	return function (s) {
		var _v1 = A5($elm$parser$Parser$Advanced$isSubString, kwd, s.b, s.br, s.a9, s.a);
		var newOffset = _v1.a;
		var newRow = _v1.b;
		var newCol = _v1.c;
		return (_Utils_eq(newOffset, -1) || (0 <= A3(
			$elm$parser$Parser$Advanced$isSubChar,
			function (c) {
				return $elm$core$Char$isAlphaNum(c) || (c === '_');
			},
			newOffset,
			s.a))) ? A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : A3(
			$elm$parser$Parser$Advanced$Good,
			progress,
			0,
			{a9: newCol, c: s.c, d: s.d, b: newOffset, br: newRow, a: s.a});
	};
};
var $elm$parser$Parser$keyword = function (kwd) {
	return $elm$parser$Parser$Advanced$keyword(
		A2(
			$elm$parser$Parser$Advanced$Token,
			kwd,
			$elm$parser$Parser$ExpectingKeyword(kwd)));
};
var $elm$parser$Parser$Advanced$Append = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$oneOfHelp = F3(
	function (s0, bag, parsers) {
		oneOfHelp:
		while (true) {
			if (!parsers.b) {
				return A2($elm$parser$Parser$Advanced$Bad, false, bag);
			} else {
				var parse = parsers.a;
				var remainingParsers = parsers.b;
				var _v1 = parse(s0);
				if (!_v1.$) {
					var step = _v1;
					return step;
				} else {
					var step = _v1;
					var p = step.a;
					var x = step.b;
					if (p) {
						return step;
					} else {
						var $temp$s0 = s0,
							$temp$bag = A2($elm$parser$Parser$Advanced$Append, bag, x),
							$temp$parsers = remainingParsers;
						s0 = $temp$s0;
						bag = $temp$bag;
						parsers = $temp$parsers;
						continue oneOfHelp;
					}
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$oneOf = function (parsers) {
	return function (s) {
		return A3($elm$parser$Parser$Advanced$oneOfHelp, s, $elm$parser$Parser$Advanced$Empty, parsers);
	};
};
var $elm$parser$Parser$oneOf = $elm$parser$Parser$Advanced$oneOf;
var $elm$parser$Parser$Advanced$chompUntilEndOr = function (str) {
	return function (s) {
		var _v0 = A5(_Parser_findSubString, str, s.b, s.br, s.a9, s.a);
		var newOffset = _v0.a;
		var newRow = _v0.b;
		var newCol = _v0.c;
		var adjustedOffset = (newOffset < 0) ? $elm$core$String$length(s.a) : newOffset;
		return A3(
			$elm$parser$Parser$Advanced$Good,
			_Utils_cmp(s.b, adjustedOffset) < 0,
			0,
			{a9: newCol, c: s.c, d: s.d, b: adjustedOffset, br: newRow, a: s.a});
	};
};
var $elm$parser$Parser$chompUntilEndOr = $elm$parser$Parser$Advanced$chompUntilEndOr;
var $elm$parser$Parser$Advanced$mapChompedString = F2(
	function (func, _v0) {
		var parse = _v0;
		return function (s0) {
			var _v1 = parse(s0);
			if (_v1.$ === 1) {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				return A3(
					$elm$parser$Parser$Advanced$Good,
					p,
					A2(
						func,
						A3($elm$core$String$slice, s0.b, s1.b, s0.a),
						a),
					s1);
			}
		};
	});
var $elm$parser$Parser$Advanced$getChompedString = function (parser) {
	return A2($elm$parser$Parser$Advanced$mapChompedString, $elm$core$Basics$always, parser);
};
var $elm$parser$Parser$getChompedString = $elm$parser$Parser$Advanced$getChompedString;
var $elm$parser$Parser$Advanced$succeed = function (a) {
	return function (s) {
		return A3($elm$parser$Parser$Advanced$Good, false, a, s);
	};
};
var $elm$parser$Parser$succeed = $elm$parser$Parser$Advanced$succeed;
var $author$project$Gradio$restParser = $elm$parser$Parser$getChompedString(
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed(0),
		$elm$parser$Parser$chompUntilEndOr('\n')));
var $elm$parser$Parser$Advanced$chompWhileHelp = F5(
	function (isGood, offset, row, col, s0) {
		chompWhileHelp:
		while (true) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, offset, s0.a);
			if (_Utils_eq(newOffset, -1)) {
				return A3(
					$elm$parser$Parser$Advanced$Good,
					_Utils_cmp(s0.b, offset) < 0,
					0,
					{a9: col, c: s0.c, d: s0.d, b: offset, br: row, a: s0.a});
			} else {
				if (_Utils_eq(newOffset, -2)) {
					var $temp$isGood = isGood,
						$temp$offset = offset + 1,
						$temp$row = row + 1,
						$temp$col = 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				} else {
					var $temp$isGood = isGood,
						$temp$offset = newOffset,
						$temp$row = row,
						$temp$col = col + 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$chompWhile = function (isGood) {
	return function (s) {
		return A5($elm$parser$Parser$Advanced$chompWhileHelp, isGood, s.b, s.br, s.a9, s);
	};
};
var $elm$parser$Parser$Advanced$spaces = $elm$parser$Parser$Advanced$chompWhile(
	function (c) {
		return (c === ' ') || ((c === '\n') || (c === '\r'));
	});
var $elm$parser$Parser$spaces = $elm$parser$Parser$Advanced$spaces;
var $elm$parser$Parser$ExpectingSymbol = function (a) {
	return {$: 8, a: a};
};
var $elm$parser$Parser$Advanced$token = function (_v0) {
	var str = _v0.a;
	var expecting = _v0.b;
	var progress = !$elm$core$String$isEmpty(str);
	return function (s) {
		var _v1 = A5($elm$parser$Parser$Advanced$isSubString, str, s.b, s.br, s.a9, s.a);
		var newOffset = _v1.a;
		var newRow = _v1.b;
		var newCol = _v1.c;
		return _Utils_eq(newOffset, -1) ? A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : A3(
			$elm$parser$Parser$Advanced$Good,
			progress,
			0,
			{a9: newCol, c: s.c, d: s.d, b: newOffset, br: newRow, a: s.a});
	};
};
var $elm$parser$Parser$Advanced$symbol = $elm$parser$Parser$Advanced$token;
var $elm$parser$Parser$symbol = function (str) {
	return $elm$parser$Parser$Advanced$symbol(
		A2(
			$elm$parser$Parser$Advanced$Token,
			str,
			$elm$parser$Parser$ExpectingSymbol(str)));
};
var $author$project$Gradio$eventParserHelper = function (_v0) {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed($elm$core$Basics$identity),
					$elm$parser$Parser$keyword('event')),
				$elm$parser$Parser$symbol(':')),
			$elm$parser$Parser$spaces),
		$elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$parser$Parser$ignorer,
					A2(
						$elm$parser$Parser$ignorer,
						A2(
							$elm$parser$Parser$ignorer,
							A2(
								$elm$parser$Parser$ignorer,
								A2(
									$elm$parser$Parser$ignorer,
									A2(
										$elm$parser$Parser$ignorer,
										A2(
											$elm$parser$Parser$ignorer,
											$elm$parser$Parser$succeed(
												$elm$parser$Parser$Loop(0)),
											$elm$parser$Parser$keyword('heartbeat')),
										$elm$parser$Parser$spaces),
									$elm$parser$Parser$keyword('data')),
								$elm$parser$Parser$symbol(':')),
							$elm$parser$Parser$spaces),
						$elm$parser$Parser$keyword('null')),
					$elm$parser$Parser$spaces),
					A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$ignorer,
						A2(
							$elm$parser$Parser$ignorer,
							A2(
								$elm$parser$Parser$ignorer,
								A2(
									$elm$parser$Parser$ignorer,
									A2(
										$elm$parser$Parser$ignorer,
										$elm$parser$Parser$succeed(
											function (rest) {
												return $elm$parser$Parser$Done(rest);
											}),
										$elm$parser$Parser$keyword('complete')),
									$elm$parser$Parser$spaces),
								$elm$parser$Parser$keyword('data')),
							$elm$parser$Parser$symbol(':')),
						$elm$parser$Parser$spaces),
					A2(
						$elm$parser$Parser$ignorer,
						A2($elm$parser$Parser$ignorer, $author$project$Gradio$restParser, $elm$parser$Parser$spaces),
						$elm$parser$Parser$end))
				])));
};
var $elm$parser$Parser$Advanced$loopHelp = F4(
	function (p, state, callback, s0) {
		loopHelp:
		while (true) {
			var _v0 = callback(state);
			var parse = _v0;
			var _v1 = parse(s0);
			if (!_v1.$) {
				var p1 = _v1.a;
				var step = _v1.b;
				var s1 = _v1.c;
				if (!step.$) {
					var newState = step.a;
					var $temp$p = p || p1,
						$temp$state = newState,
						$temp$callback = callback,
						$temp$s0 = s1;
					p = $temp$p;
					state = $temp$state;
					callback = $temp$callback;
					s0 = $temp$s0;
					continue loopHelp;
				} else {
					var result = step.a;
					return A3($elm$parser$Parser$Advanced$Good, p || p1, result, s1);
				}
			} else {
				var p1 = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p || p1, x);
			}
		}
	});
var $elm$parser$Parser$Advanced$loop = F2(
	function (state, callback) {
		return function (s) {
			return A4($elm$parser$Parser$Advanced$loopHelp, false, state, callback, s);
		};
	});
var $elm$parser$Parser$Advanced$map = F2(
	function (func, _v0) {
		var parse = _v0;
		return function (s0) {
			var _v1 = parse(s0);
			if (!_v1.$) {
				var p = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				return A3(
					$elm$parser$Parser$Advanced$Good,
					p,
					func(a),
					s1);
			} else {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			}
		};
	});
var $elm$parser$Parser$map = $elm$parser$Parser$Advanced$map;
var $elm$parser$Parser$Advanced$Done = function (a) {
	return {$: 1, a: a};
};
var $elm$parser$Parser$Advanced$Loop = function (a) {
	return {$: 0, a: a};
};
var $elm$parser$Parser$toAdvancedStep = function (step) {
	if (!step.$) {
		var s = step.a;
		return $elm$parser$Parser$Advanced$Loop(s);
	} else {
		var a = step.a;
		return $elm$parser$Parser$Advanced$Done(a);
	}
};
var $elm$parser$Parser$loop = F2(
	function (state, callback) {
		return A2(
			$elm$parser$Parser$Advanced$loop,
			state,
			function (s) {
				return A2(
					$elm$parser$Parser$map,
					$elm$parser$Parser$toAdvancedStep,
					callback(s));
			});
	});
var $author$project$Gradio$eventParser = A2($elm$parser$Parser$loop, 0, $author$project$Gradio$eventParserHelper);
var $elm$parser$Parser$DeadEnd = F3(
	function (row, col, problem) {
		return {a9: col, bo: problem, br: row};
	});
var $elm$parser$Parser$problemToDeadEnd = function (p) {
	return A3($elm$parser$Parser$DeadEnd, p.br, p.a9, p.bo);
};
var $elm$parser$Parser$Advanced$bagToList = F2(
	function (bag, list) {
		bagToList:
		while (true) {
			switch (bag.$) {
				case 0:
					return list;
				case 1:
					var bag1 = bag.a;
					var x = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$core$List$cons, x, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
				default:
					var bag1 = bag.a;
					var bag2 = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$parser$Parser$Advanced$bagToList, bag2, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
			}
		}
	});
var $elm$parser$Parser$Advanced$run = F2(
	function (_v0, src) {
		var parse = _v0;
		var _v1 = parse(
			{a9: 1, c: _List_Nil, d: 1, b: 0, br: 1, a: src});
		if (!_v1.$) {
			var value = _v1.b;
			return $elm$core$Result$Ok(value);
		} else {
			var bag = _v1.b;
			return $elm$core$Result$Err(
				A2($elm$parser$Parser$Advanced$bagToList, bag, _List_Nil));
		}
	});
var $elm$parser$Parser$run = F2(
	function (parser, source) {
		var _v0 = A2($elm$parser$Parser$Advanced$run, parser, source);
		if (!_v0.$) {
			var a = _v0.a;
			return $elm$core$Result$Ok(a);
		} else {
			var problems = _v0.a;
			return $elm$core$Result$Err(
				A2($elm$core$List$map, $elm$parser$Parser$problemToDeadEnd, problems));
		}
	});
var $author$project$Gradio$parsingResolver = function (raw) {
	return A2(
		$elm$core$Result$mapError,
		A2($elm$core$Basics$composeR, $author$project$Gradio$deadEndsToString, $author$project$Gradio$ParsingError),
		A2($elm$parser$Parser$run, $author$project$Gradio$eventParser, raw));
};
var $elm$http$Http$stringResolver = A2(_Http_expect, '', $elm$core$Basics$identity);
var $elm$core$Task$fail = _Scheduler_fail;
var $elm$http$Http$resultToTask = function (result) {
	if (!result.$) {
		var a = result.a;
		return $elm$core$Task$succeed(a);
	} else {
		var x = result.a;
		return $elm$core$Task$fail(x);
	}
};
var $elm$http$Http$task = function (r) {
	return A3(
		_Http_toTask,
		0,
		$elm$http$Http$resultToTask,
		{a7: false, ap: r.ap, ae: r.aT, ay: r.ay, aF: r.aF, a_: r.a_, a$: $elm$core$Maybe$Nothing, a1: r.a1});
};
var $author$project$Gradio$finish = F4(
	function (cfg, path, decoder, eventId) {
		return $elm$http$Http$task(
			{
				ap: $elm$http$Http$emptyBody,
				ay: _List_Nil,
				aF: 'GET',
				aT: $elm$http$Http$stringResolver(
					A2(
						$elm$core$Basics$composeR,
						$author$project$Gradio$httpResolver,
						A2(
							$elm$core$Basics$composeR,
							$elm$core$Result$andThen($author$project$Gradio$parsingResolver),
							$elm$core$Result$andThen(
								$author$project$Gradio$jsonResolver(decoder))))),
				a_: $elm$core$Maybe$Nothing,
				a1: A3(
					$elm$url$Url$Builder$crossOrigin,
					cfg.af,
					_List_fromArray(
						['gradio_api', 'call', path, eventId]),
					_List_Nil)
			});
	});
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(0),
				entries));
	});
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(0),
			pairs));
};
var $author$project$Gradio$encodeArgs = function (args) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'data',
				A2($elm$json$Json$Encode$list, $elm$core$Basics$identity, args))
			]));
};
var $author$project$Gradio$eventIdDecoder = A2($elm$json$Json$Decode$field, 'event_id', $elm$json$Json$Decode$string);
var $elm$http$Http$jsonBody = function (value) {
	return A2(
		_Http_pair,
		'application/json',
		A2($elm$json$Json$Encode$encode, 0, value));
};
var $author$project$Gradio$start = F3(
	function (cfg, path, args) {
		return $elm$http$Http$task(
			{
				ap: $elm$http$Http$jsonBody(
					$author$project$Gradio$encodeArgs(args)),
				ay: _List_Nil,
				aF: 'POST',
				aT: $elm$http$Http$stringResolver(
					A2(
						$elm$core$Basics$composeR,
						$author$project$Gradio$httpResolver,
						$elm$core$Result$andThen(
							$author$project$Gradio$jsonResolver($author$project$Gradio$eventIdDecoder)))),
				a_: $elm$core$Maybe$Nothing,
				a1: A3(
					$elm$url$Url$Builder$crossOrigin,
					cfg.af,
					_List_fromArray(
						['gradio_api', 'call', path]),
					_List_Nil)
			});
	});
var $author$project$Gradio$get = F5(
	function (cfg, path, args, decoder, msg) {
		return A2(
			$elm$core$Task$attempt,
			msg,
			A2(
				$elm$core$Task$andThen,
				A3($author$project$Gradio$finish, cfg, path, decoder),
				A3($author$project$Gradio$start, cfg, path, args)));
	});
var $elm$json$Json$Encode$int = _Json_wrap;
var $author$project$Semseg$getExample = F3(
	function (cfg, id, img) {
		return A5(
			$author$project$Gradio$get,
			cfg,
			'get-img',
			_List_fromArray(
				[
					$elm$json$Json$Encode$int(img)
				]),
			$author$project$Gradio$decodeOne($author$project$Semseg$exampleDecoder),
			$author$project$Semseg$GotExample(id));
	});
var $author$project$Requests$Id = $elm$core$Basics$identity;
var $author$project$Requests$init = 0;
var $author$project$Semseg$isProduction = true;
var $author$project$Requests$next = function (_v0) {
	var id = _v0;
	return id + 1;
};
var $elm$url$Url$Parser$State = F5(
	function (visited, unvisited, params, frag, value) {
		return {F: frag, I: params, C: unvisited, x: value, L: visited};
	});
var $elm$url$Url$Parser$getFirstMatch = function (states) {
	getFirstMatch:
	while (true) {
		if (!states.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var state = states.a;
			var rest = states.b;
			var _v1 = state.C;
			if (!_v1.b) {
				return $elm$core$Maybe$Just(state.x);
			} else {
				if ((_v1.a === '') && (!_v1.b.b)) {
					return $elm$core$Maybe$Just(state.x);
				} else {
					var $temp$states = rest;
					states = $temp$states;
					continue getFirstMatch;
				}
			}
		}
	}
};
var $elm$url$Url$Parser$removeFinalEmpty = function (segments) {
	if (!segments.b) {
		return _List_Nil;
	} else {
		if ((segments.a === '') && (!segments.b.b)) {
			return _List_Nil;
		} else {
			var segment = segments.a;
			var rest = segments.b;
			return A2(
				$elm$core$List$cons,
				segment,
				$elm$url$Url$Parser$removeFinalEmpty(rest));
		}
	}
};
var $elm$url$Url$Parser$preparePath = function (path) {
	var _v0 = A2($elm$core$String$split, '/', path);
	if (_v0.b && (_v0.a === '')) {
		var segments = _v0.b;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	} else {
		var segments = _v0;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	}
};
var $elm$url$Url$Parser$addToParametersHelp = F2(
	function (value, maybeList) {
		if (maybeList.$ === 1) {
			return $elm$core$Maybe$Just(
				_List_fromArray(
					[value]));
		} else {
			var list = maybeList.a;
			return $elm$core$Maybe$Just(
				A2($elm$core$List$cons, value, list));
		}
	});
var $elm$url$Url$percentDecode = _Url_percentDecode;
var $elm$url$Url$Parser$addParam = F2(
	function (segment, dict) {
		var _v0 = A2($elm$core$String$split, '=', segment);
		if ((_v0.b && _v0.b.b) && (!_v0.b.b.b)) {
			var rawKey = _v0.a;
			var _v1 = _v0.b;
			var rawValue = _v1.a;
			var _v2 = $elm$url$Url$percentDecode(rawKey);
			if (_v2.$ === 1) {
				return dict;
			} else {
				var key = _v2.a;
				var _v3 = $elm$url$Url$percentDecode(rawValue);
				if (_v3.$ === 1) {
					return dict;
				} else {
					var value = _v3.a;
					return A3(
						$elm$core$Dict$update,
						key,
						$elm$url$Url$Parser$addToParametersHelp(value),
						dict);
				}
			}
		} else {
			return dict;
		}
	});
var $elm$url$Url$Parser$prepareQuery = function (maybeQuery) {
	if (maybeQuery.$ === 1) {
		return $elm$core$Dict$empty;
	} else {
		var qry = maybeQuery.a;
		return A3(
			$elm$core$List$foldr,
			$elm$url$Url$Parser$addParam,
			$elm$core$Dict$empty,
			A2($elm$core$String$split, '&', qry));
	}
};
var $elm$url$Url$Parser$parse = F2(
	function (_v0, url) {
		var parser = _v0;
		return $elm$url$Url$Parser$getFirstMatch(
			parser(
				A5(
					$elm$url$Url$Parser$State,
					_List_Nil,
					$elm$url$Url$Parser$preparePath(url.aI),
					$elm$url$Url$Parser$prepareQuery(url.aO),
					url.ax,
					$elm$core$Basics$identity)));
	});
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $elm$random$Random$peel = function (_v0) {
	var state = _v0.a;
	var word = (state ^ (state >>> ((state >>> 28) + 4))) * 277803737;
	return ((word >>> 22) ^ word) >>> 0;
};
var $elm$random$Random$int = F2(
	function (a, b) {
		return function (seed0) {
			var _v0 = (_Utils_cmp(a, b) < 0) ? _Utils_Tuple2(a, b) : _Utils_Tuple2(b, a);
			var lo = _v0.a;
			var hi = _v0.b;
			var range = (hi - lo) + 1;
			if (!((range - 1) & range)) {
				return _Utils_Tuple2(
					(((range - 1) & $elm$random$Random$peel(seed0)) >>> 0) + lo,
					$elm$random$Random$next(seed0));
			} else {
				var threshhold = (((-range) >>> 0) % range) >>> 0;
				var accountForBias = function (seed) {
					accountForBias:
					while (true) {
						var x = $elm$random$Random$peel(seed);
						var seedN = $elm$random$Random$next(seed);
						if (_Utils_cmp(x, threshhold) < 0) {
							var $temp$seed = seedN;
							seed = $temp$seed;
							continue accountForBias;
						} else {
							return _Utils_Tuple2((x % range) + lo, seedN);
						}
					}
				};
				return accountForBias(seed0);
			}
		};
	});
var $author$project$Semseg$nImages = 2000;
var $author$project$Semseg$randomExample = A2($elm$random$Random$int, 0, $author$project$Semseg$nImages - 1);
var $author$project$Semseg$QueryParams = function (index) {
	return {o: index};
};
var $elm$url$Url$Parser$Internal$Parser = $elm$core$Basics$identity;
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $elm$url$Url$Parser$Query$custom = F2(
	function (key, func) {
		return function (dict) {
			return func(
				A2(
					$elm$core$Maybe$withDefault,
					_List_Nil,
					A2($elm$core$Dict$get, key, dict)));
		};
	});
var $elm$url$Url$Parser$Query$int = function (key) {
	return A2(
		$elm$url$Url$Parser$Query$custom,
		key,
		function (stringList) {
			if (stringList.b && (!stringList.b.b)) {
				var str = stringList.a;
				return $elm$core$String$toInt(str);
			} else {
				return $elm$core$Maybe$Nothing;
			}
		});
};
var $elm$url$Url$Parser$Parser = $elm$core$Basics$identity;
var $elm$url$Url$Parser$mapState = F2(
	function (func, _v0) {
		var visited = _v0.L;
		var unvisited = _v0.C;
		var params = _v0.I;
		var frag = _v0.F;
		var value = _v0.x;
		return A5(
			$elm$url$Url$Parser$State,
			visited,
			unvisited,
			params,
			frag,
			func(value));
	});
var $elm$url$Url$Parser$map = F2(
	function (subValue, _v0) {
		var parseArg = _v0;
		return function (_v1) {
			var visited = _v1.L;
			var unvisited = _v1.C;
			var params = _v1.I;
			var frag = _v1.F;
			var value = _v1.x;
			return A2(
				$elm$core$List$map,
				$elm$url$Url$Parser$mapState(value),
				parseArg(
					A5($elm$url$Url$Parser$State, visited, unvisited, params, frag, subValue)));
		};
	});
var $elm$url$Url$Parser$query = function (_v0) {
	var queryParser = _v0;
	return function (_v1) {
		var visited = _v1.L;
		var unvisited = _v1.C;
		var params = _v1.I;
		var frag = _v1.F;
		var value = _v1.x;
		return _List_fromArray(
			[
				A5(
				$elm$url$Url$Parser$State,
				visited,
				unvisited,
				params,
				frag,
				value(
					queryParser(params)))
			]);
	};
};
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $elm$url$Url$Parser$slash = F2(
	function (_v0, _v1) {
		var parseBefore = _v0;
		var parseAfter = _v1;
		return function (state) {
			return A2(
				$elm$core$List$concatMap,
				parseAfter,
				parseBefore(state));
		};
	});
var $elm$url$Url$Parser$questionMark = F2(
	function (parser, queryParser) {
		return A2(
			$elm$url$Url$Parser$slash,
			parser,
			$elm$url$Url$Parser$query(queryParser));
	});
var $elm$url$Url$Parser$s = function (str) {
	return function (_v0) {
		var visited = _v0.L;
		var unvisited = _v0.C;
		var params = _v0.I;
		var frag = _v0.F;
		var value = _v0.x;
		if (!unvisited.b) {
			return _List_Nil;
		} else {
			var next = unvisited.a;
			var rest = unvisited.b;
			return _Utils_eq(next, str) ? _List_fromArray(
				[
					A5(
					$elm$url$Url$Parser$State,
					A2($elm$core$List$cons, next, visited),
					rest,
					params,
					frag,
					value)
				]) : _List_Nil;
		}
	};
};
var $author$project$Semseg$urlParser = $author$project$Semseg$isProduction ? A2(
	$elm$url$Url$Parser$map,
	$author$project$Semseg$QueryParams,
	A2(
		$elm$url$Url$Parser$slash,
		$elm$url$Url$Parser$s('saev'),
		A2(
			$elm$url$Url$Parser$slash,
			$elm$url$Url$Parser$s('demos'),
			A2(
				$elm$url$Url$Parser$questionMark,
				$elm$url$Url$Parser$s('semseg'),
				$elm$url$Url$Parser$Query$int('example'))))) : A2(
	$elm$url$Url$Parser$map,
	$author$project$Semseg$QueryParams,
	A2(
		$elm$url$Url$Parser$slash,
		$elm$url$Url$Parser$s('web'),
		A2(
			$elm$url$Url$Parser$slash,
			$elm$url$Url$Parser$s('apps'),
			A2(
				$elm$url$Url$Parser$questionMark,
				$elm$url$Url$Parser$s('semseg'),
				$elm$url$Url$Parser$Query$int('example')))));
var $author$project$Semseg$init = F3(
	function (_v0, url, key) {
		var gradio = $author$project$Semseg$isProduction ? {af: 'https://samuelstevens-saev-semantic-segmentation.hf.space'} : {af: 'http://localhost:7860'};
		var _v1 = function () {
			var _v2 = A2(
				$elm$core$Maybe$andThen,
				function ($) {
					return $.o;
				},
				A2($elm$url$Url$Parser$parse, $author$project$Semseg$urlParser, url));
			if (!_v2.$) {
				var index = _v2.a;
				return _Utils_Tuple2(
					$elm$core$Maybe$Just(index),
					A3(
						$author$project$Semseg$getExample,
						gradio,
						$author$project$Requests$next($author$project$Requests$init),
						index));
			} else {
				return _Utils_Tuple2(
					$elm$core$Maybe$Nothing,
					A2($elm$random$Random$generate, $author$project$Semseg$SetUrl, $author$project$Semseg$randomExample));
			}
		}();
		var ade20kIndex = _v1.a;
		var cmd = _v1.b;
		var model = {ab: ade20kIndex, k: $author$project$Requests$Initial, T: $author$project$Requests$init, G: gradio, U: $elm$core$Maybe$Nothing, V: false, ag: key, r: $author$project$Requests$Initial, ad: $author$project$Requests$init, w: $author$project$Requests$Initial, H: $author$project$Requests$init, u: $author$project$Requests$Initial, X: $author$project$Requests$init, p: $elm$core$Set$empty, O: $elm$core$Dict$empty, Q: $elm$core$Dict$empty};
		return _Utils_Tuple2(model, cmd);
	});
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $author$project$Semseg$SetExample = function (a) {
	return {$: 2, a: a};
};
var $author$project$Semseg$onUrlChange = function (url) {
	return $author$project$Semseg$SetExample(
		A2(
			$elm$core$Maybe$withDefault,
			0,
			A2(
				$elm$core$Maybe$andThen,
				function ($) {
					return $.o;
				},
				A2($elm$url$Url$Parser$parse, $author$project$Semseg$urlParser, url))));
};
var $author$project$Semseg$NoOp = {$: 0};
var $author$project$Semseg$onUrlRequest = function (request) {
	return $author$project$Semseg$NoOp;
};
var $author$project$Requests$Failed = function (a) {
	return {$: 3, a: a};
};
var $author$project$Requests$Loaded = function (a) {
	return {$: 2, a: a};
};
var $author$project$Requests$Loading = {$: 1};
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $author$project$Semseg$GotModPreds = F2(
	function (a, b) {
		return {$: 13, a: a, b: b};
	});
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === -2) {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$json$Json$Encode$dict = F3(
	function (toKey, toValue, dictionary) {
		return _Json_wrap(
			A3(
				$elm$core$Dict$foldl,
				F3(
					function (key, value, obj) {
						return A3(
							_Json_addField,
							toKey(key),
							toValue(value),
							obj);
					}),
				_Json_emptyObject(0),
				dictionary));
	});
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Gradio$encodeImg = function (_v0) {
	var image = _v0;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'url',
				$elm$json$Json$Encode$string(image))
			]));
};
var $elm$json$Json$Encode$float = _Json_wrap;
var $author$project$Semseg$getModPreds = F4(
	function (cfg, id, img, sliders) {
		return A5(
			$author$project$Gradio$get,
			cfg,
			'get-mod-preds',
			_List_fromArray(
				[
					$author$project$Gradio$encodeImg(img),
					A3($elm$json$Json$Encode$dict, $elm$core$String$fromInt, $elm$json$Json$Encode$float, sliders)
				]),
			$author$project$Gradio$decodeOne($author$project$Semseg$exampleDecoder),
			$author$project$Semseg$GotModPreds(id));
	});
var $author$project$Semseg$GotOrigPreds = F2(
	function (a, b) {
		return {$: 12, a: a, b: b};
	});
var $author$project$Semseg$getOrigPreds = F3(
	function (cfg, id, img) {
		return A5(
			$author$project$Gradio$get,
			cfg,
			'get-orig-preds',
			_List_fromArray(
				[
					$author$project$Gradio$encodeImg(img)
				]),
			$author$project$Gradio$decodeOne($author$project$Semseg$exampleDecoder),
			$author$project$Semseg$GotOrigPreds(id));
	});
var $author$project$Semseg$GotSaeLatents = F2(
	function (a, b) {
		return {$: 11, a: a, b: b};
	});
var $author$project$Semseg$SaeLatent = F2(
	function (latent, examples) {
		return {au: examples, z: latent};
	});
var $author$project$Semseg$HighlightedExample = F4(
	function (image, highlighted, labels, classes) {
		return {ac: classes, aB: highlighted, h: image, N: labels};
	});
var $elm$json$Json$Decode$map4 = _Json_map4;
var $author$project$Semseg$highlightedExampleDecoder = A5(
	$elm$json$Json$Decode$map4,
	$author$project$Semseg$HighlightedExample,
	A2($elm$json$Json$Decode$field, 'orig_url', $author$project$Gradio$base64ImageDecoder),
	A2($elm$json$Json$Decode$field, 'highlighted_url', $author$project$Gradio$base64ImageDecoder),
	A2($elm$json$Json$Decode$field, 'seg_url', $author$project$Gradio$base64ImageDecoder),
	A2(
		$elm$json$Json$Decode$field,
		'classes',
		A2(
			$elm$json$Json$Decode$map,
			$elm$core$Set$fromList,
			$elm$json$Json$Decode$list($elm$json$Json$Decode$int))));
var $author$project$Semseg$getSaeLatents = F4(
	function (cfg, id, img, patches) {
		return A5(
			$author$project$Gradio$get,
			cfg,
			'get-sae-latents',
			_List_fromArray(
				[
					$author$project$Gradio$encodeImg(img),
					A2(
					$elm$json$Json$Encode$list,
					$elm$json$Json$Encode$int,
					$elm$core$Set$toList(patches))
				]),
			$author$project$Gradio$decodeOne(
				$elm$json$Json$Decode$list(
					A3(
						$elm$json$Json$Decode$map2,
						$author$project$Semseg$SaeLatent,
						A2($elm$json$Json$Decode$field, 'latent', $elm$json$Json$Decode$int),
						A2(
							$elm$json$Json$Decode$field,
							'examples',
							$elm$json$Json$Decode$list($author$project$Semseg$highlightedExampleDecoder))))),
			$author$project$Semseg$GotSaeLatents(id));
	});
var $author$project$Semseg$GotFile = function (a) {
	return {$: 3, a: a};
};
var $author$project$Semseg$GotPreview = function (a) {
	return {$: 4, a: a};
};
var $author$project$Semseg$ImageUploader = function (a) {
	return {$: 14, a: a};
};
var $author$project$Gradio$UserError = function (a) {
	return {$: 4, a: a};
};
var $author$project$Gradio$base64ImageEmpty = 'data:image/webp;base64,UklGRtABAABXRUJQVlA4WAoAAAAQAAAAvwEAvwEAQUxQSBsAAAABBxAREVDQtg1T/vC744j+Z/jPf/7zn//8LwEAVlA4II4BAABQLQCdASrAAcABPpFIoU0lpCMiIAgAsBIJaW7hd2EbQAnsA99snIe+2TkPfbJyHvtk5D32ych77ZOQ99snIe+2TkPfbJyHvtk5D32ych77ZOQ99snIe+2TkPfbJyHvtk5D32ych77ZOQ99snIe+2TkPfbJyHvtk5D32ych77ZOQ99snIe+2TkPfbJyHvtk5D32ych77ZOQ99snIe+2TkPfbJyHvtk5D32ych77ZOQ99snIe+2TkPfbJyHvtk5D32ych77ZOQ99snIe+2TkPfbJyHvtk5D32ych77ZOQ99snIe+2TkPfbJyHvtk5D32ych77ZOQ99snIe+2TkPfbJyHvtk5D32ych77ZOQ99snIe+2TkPfbJyHvtk5D32ych77ZOQ99snIe+2TkPfbJyHvtk5D32ych77ZOQ99snIe+2TkPfbJyHvtk5D32ych77ZOQ99snIe+2TkPfbJyHvtk5D32ych77ZOQ99snIe+2TkPfasAD+/94IrMAAAAAAAAAAAAAAAAAAAAAAAAAAAA==';
var $elm$file$File$Select$file = F2(
	function (mimes, toMsg) {
		return A2(
			$elm$core$Task$perform,
			toMsg,
			_File_uploadOne(mimes));
	});
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $elm$file$File$toUrl = _File_toUrl;
var $author$project$Semseg$imageUploaderUpdate = F2(
	function (model, msg) {
		switch (msg.$) {
			case 0:
				return _Utils_Tuple2(
					model,
					A2(
						$elm$file$File$Select$file,
						_List_fromArray(
							['image/*']),
						A2($elm$core$Basics$composeR, $author$project$Semseg$GotFile, $author$project$Semseg$ImageUploader)));
			case 1:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{V: true}),
					$elm$core$Platform$Cmd$none);
			case 2:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{V: false}),
					$elm$core$Platform$Cmd$none);
			case 3:
				var file = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{V: false}),
					A2(
						$elm$core$Task$perform,
						A2($elm$core$Basics$composeR, $author$project$Semseg$GotPreview, $author$project$Semseg$ImageUploader),
						$elm$file$File$toUrl(file)));
			default:
				var preview = msg.a;
				var _v1 = $author$project$Gradio$base64Image(preview);
				if (!_v1.$) {
					var image = _v1.a;
					var origPredsReqId = $author$project$Requests$next(model.H);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								k: $author$project$Requests$Loaded(
									{ac: $elm$core$Set$empty, h: image, N: $author$project$Gradio$base64ImageEmpty}),
								r: $author$project$Requests$Initial,
								w: $author$project$Requests$Loading,
								H: origPredsReqId,
								u: $author$project$Requests$Initial,
								p: $elm$core$Set$empty
							}),
						A3($author$project$Semseg$getOrigPreds, model.G, origPredsReqId, image));
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								k: $author$project$Requests$Failed(
									$author$project$Gradio$UserError('Uploaded image was not base64.'))
							}),
						$elm$core$Platform$Cmd$none);
				}
		}
	});
var $elm$url$Url$Builder$QueryParameter = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$url$Url$percentEncode = _Url_percentEncode;
var $elm$url$Url$Builder$int = F2(
	function (key, value) {
		return A2(
			$elm$url$Url$Builder$QueryParameter,
			$elm$url$Url$percentEncode(key),
			$elm$core$String$fromInt(value));
	});
var $elm$core$Dict$isEmpty = function (dict) {
	if (dict.$ === -2) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Set$isEmpty = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$isEmpty(dict);
};
var $author$project$Requests$isStale = F2(
	function (_v0, _v1) {
		var id = _v0;
		var last = _v1;
		return _Utils_cmp(id, last) < 0;
	});
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (!_v0.$) {
			return true;
		} else {
			return false;
		}
	});
var $elm$core$Set$member = F2(
	function (key, _v0) {
		var dict = _v0;
		return A2($elm$core$Dict$member, key, dict);
	});
var $elm$core$Basics$modBy = _Basics_modBy;
var $elm$browser$Browser$Navigation$pushUrl = _Browser_pushUrl;
var $elm$url$Url$Builder$relative = F2(
	function (pathSegments, parameters) {
		return _Utils_ap(
			A2($elm$core$String$join, '/', pathSegments),
			$elm$url$Url$Builder$toQuery(parameters));
	});
var $elm$core$Set$remove = F2(
	function (key, _v0) {
		var dict = _v0;
		return A2($elm$core$Dict$remove, key, dict);
	});
var $elm$core$String$toFloat = _String_toFloat;
var $author$project$Semseg$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 1:
				var i = msg.a;
				var url = A2(
					$elm$url$Url$Builder$relative,
					_List_Nil,
					_List_fromArray(
						[
							A2($elm$url$Url$Builder$int, 'example', i)
						]));
				return _Utils_Tuple2(
					model,
					A2($elm$browser$Browser$Navigation$pushUrl, model.ag, url));
			case 2:
				var i = msg.a;
				var index = A2($elm$core$Basics$modBy, $author$project$Semseg$nImages, i);
				var exampleReqId = $author$project$Requests$next(model.T);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							ab: $elm$core$Maybe$Just(index),
							k: $author$project$Requests$Loading,
							T: exampleReqId,
							r: $author$project$Requests$Initial,
							w: $author$project$Requests$Loading,
							u: $author$project$Requests$Initial,
							p: $elm$core$Set$empty
						}),
					A3($author$project$Semseg$getExample, model.G, exampleReqId, index));
			case 3:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{k: $author$project$Requests$Loading, r: $author$project$Requests$Initial, w: $author$project$Requests$Loading, u: $author$project$Requests$Initial, p: $elm$core$Set$empty}),
					A2($elm$random$Random$generate, $author$project$Semseg$SetUrl, $author$project$Semseg$randomExample));
			case 4:
				var i = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							U: $elm$core$Maybe$Just(i)
						}),
					$elm$core$Platform$Cmd$none);
			case 5:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{U: $elm$core$Maybe$Nothing}),
					$elm$core$Platform$Cmd$none);
			case 6:
				var i = msg.a;
				var saeLatentsReqId = $author$project$Requests$next(model.X);
				var patchIndices = A2($elm$core$Set$member, i, model.p) ? A2($elm$core$Set$remove, i, model.p) : A2($elm$core$Set$insert, i, model.p);
				var saeLatents = $elm$core$Set$isEmpty(patchIndices) ? $author$project$Requests$Initial : $author$project$Requests$Loading;
				var cmd = function () {
					var _v1 = model.k;
					if (_v1.$ === 2) {
						var image = _v1.a.h;
						return A4($author$project$Semseg$getSaeLatents, model.G, saeLatentsReqId, image, patchIndices);
					} else {
						return $elm$core$Platform$Cmd$none;
					}
				}();
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{r: $author$project$Requests$Initial, u: saeLatents, X: saeLatentsReqId, p: patchIndices}),
					cmd);
			case 7:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{r: $author$project$Requests$Initial, u: $author$project$Requests$Initial, p: $elm$core$Set$empty}),
					$elm$core$Platform$Cmd$none);
			case 8:
				var i = msg.a;
				var str = msg.b;
				var _v2 = $elm$core$String$toFloat(str);
				if (!_v2.$) {
					var f = _v2.a;
					var sliders = A3($elm$core$Dict$insert, i, f, model.O);
					var modPredsReqId = $author$project$Requests$next(model.ad);
					var cmd = function () {
						var _v3 = model.k;
						if (_v3.$ === 2) {
							var image = _v3.a.h;
							return A4($author$project$Semseg$getModPreds, model.G, modPredsReqId, image, sliders);
						} else {
							return $elm$core$Platform$Cmd$none;
						}
					}();
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{O: sliders}),
						cmd);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 9:
				var latent = msg.a;
				var toggles = A3(
					$elm$core$Dict$update,
					latent,
					A2(
						$elm$core$Basics$composeR,
						$elm$core$Maybe$withDefault(true),
						A2($elm$core$Basics$composeR, $elm$core$Basics$not, $elm$core$Maybe$Just)),
					model.Q);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{Q: toggles}),
					$elm$core$Platform$Cmd$none);
			case 10:
				var id = msg.a;
				var result = msg.b;
				if (A2($author$project$Requests$isStale, id, model.T)) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					if (!result.$) {
						var example = result.a;
						var origPredsReqId = $author$project$Requests$next(model.H);
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									k: $author$project$Requests$Loaded(example),
									H: origPredsReqId
								}),
							A3($author$project$Semseg$getOrigPreds, model.G, origPredsReqId, example.h));
					} else {
						var err = result.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									k: $author$project$Requests$Failed(err)
								}),
							$elm$core$Platform$Cmd$none);
					}
				}
			case 11:
				var id = msg.a;
				var result = msg.b;
				if (A2($author$project$Requests$isStale, id, model.X)) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					if (!result.$) {
						var latents = result.a;
						var toggles = $elm$core$Dict$fromList(
							A2(
								$elm$core$List$map,
								function (latent) {
									return _Utils_Tuple2(latent.z, true);
								},
								latents));
						var sliders = $elm$core$Dict$fromList(
							A2(
								$elm$core$List$map,
								function (latent) {
									return _Utils_Tuple2(latent, 0.0);
								},
								A2(
									$elm$core$List$map,
									function ($) {
										return $.z;
									},
									latents)));
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									u: $author$project$Requests$Loaded(latents),
									O: sliders,
									Q: toggles
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						var err = result.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									u: $author$project$Requests$Failed(err)
								}),
							$elm$core$Platform$Cmd$none);
					}
				}
			case 12:
				var id = msg.a;
				var result = msg.b;
				if (A2($author$project$Requests$isStale, id, model.H)) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					if (!result.$) {
						var preds = result.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									w: $author$project$Requests$Loaded(preds)
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						var err = result.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									w: $author$project$Requests$Failed(err)
								}),
							$elm$core$Platform$Cmd$none);
					}
				}
			case 13:
				var id = msg.a;
				var result = msg.b;
				if (A2($author$project$Requests$isStale, id, model.ad)) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					if (!result.$) {
						var preds = result.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									r: $author$project$Requests$Loaded(preds)
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						var err = result.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									r: $author$project$Requests$Failed(err)
								}),
							$elm$core$Platform$Cmd$none);
					}
				}
			default:
				var imageMsg = msg.a;
				return A2($author$project$Semseg$imageUploaderUpdate, model, imageMsg);
		}
	});
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$div = _VirtualDom_node('div');
var $author$project$Semseg$getClasses = function (example) {
	switch (example.$) {
		case 1:
			return $elm$core$Set$empty;
		case 0:
			return $elm$core$Set$empty;
		case 3:
			return $elm$core$Set$empty;
		default:
			var classes = example.a.ac;
			return classes;
	}
};
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $elm$html$Html$main_ = _VirtualDom_node('main');
var $author$project$Requests$map = F2(
	function (fn, requested) {
		switch (requested.$) {
			case 0:
				return $author$project$Requests$Initial;
			case 1:
				return $author$project$Requests$Loading;
			case 3:
				var err = requested.a;
				return $author$project$Requests$Failed(err);
			default:
				var a = requested.a;
				return $author$project$Requests$Loaded(
					fn(a));
		}
	});
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $elm$core$Set$union = F2(
	function (_v0, _v1) {
		var dict1 = _v0;
		var dict2 = _v1;
		return A2($elm$core$Dict$union, dict1, dict2);
	});
var $author$project$Semseg$GetRandomExample = {$: 3};
var $author$project$Semseg$Upload = {$: 0};
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $author$project$Semseg$viewButton = F3(
	function (onClick, title, enabled) {
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Events$onClick(onClick),
					$elm$html$Html$Attributes$disabled(!enabled),
					$elm$html$Html$Attributes$class('flex-1 rounded-lg px-2 py-1 transition-colors'),
					$elm$html$Html$Attributes$class('border border-sky-300 hover:border-sky-400'),
					$elm$html$Html$Attributes$class('bg-sky-100 hover:bg-sky-200'),
					$elm$html$Html$Attributes$class('text-gray-700 hover:text-gray-900'),
					$elm$html$Html$Attributes$class('focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2'),
					$elm$html$Html$Attributes$class('active:bg-gray-300'),
					$elm$html$Html$Attributes$class('disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-400'),
					$elm$html$Html$Attributes$class('disabled:cursor-not-allowed'),
					$elm$html$Html$Attributes$class('disabled:hover:bg-gray-100 disabled:hover:border-gray-200 disabled:hover:text-gray-400')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(title)
				]));
	});
var $author$project$Semseg$viewControls = function (ade20kIndex) {
	var _v0 = function () {
		if (!ade20kIndex.$) {
			var i = ade20kIndex.a;
			return _Utils_Tuple2(
				A3(
					$author$project$Semseg$viewButton,
					$author$project$Semseg$SetUrl(i - 1),
					'Previous',
					true),
				A3(
					$author$project$Semseg$viewButton,
					$author$project$Semseg$SetUrl(i + 1),
					'Next',
					true));
		} else {
			return _Utils_Tuple2(
				A3($author$project$Semseg$viewButton, $author$project$Semseg$NoOp, 'Previous', false),
				A3($author$project$Semseg$viewButton, $author$project$Semseg$NoOp, 'Next', false));
		}
	}();
	var prevButton = _v0.a;
	var nextButton = _v0.b;
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('flex flex-row gap-2')
			]),
		_List_fromArray(
			[
				prevButton,
				A3($author$project$Semseg$viewButton, $author$project$Semseg$GetRandomExample, 'Random', true),
				nextButton,
				A3(
				$author$project$Semseg$viewButton,
				$author$project$Semseg$ImageUploader($author$project$Semseg$Upload),
				'Upload',
				true)
			]));
};
var $elm$html$Html$a = _VirtualDom_node('a');
var $author$project$Gradio$base64ImageToString = function (_v0) {
	var str = _v0;
	return str;
};
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$html$Html$img = _VirtualDom_node('img');
var $elm$html$Html$p = _VirtualDom_node('p');
var $elm$html$Html$Attributes$rel = _VirtualDom_attribute('rel');
var $elm$html$Html$span = _VirtualDom_node('span');
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $elm$html$Html$Attributes$target = $elm$html$Html$Attributes$stringProperty('target');
var $author$project$Semseg$explainGradioError = function (err) {
	var githubLink = A2(
		$elm$html$Html$a,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$href('https://github.com/Imageomics/saev/issues/new'),
				$elm$html$Html$Attributes$class('text-sky-500 hover:underline')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text('GitHub')
			]));
	switch (err.$) {
		case 0:
			var msg = err.a;
			return A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Network error: ' + (msg + '. Try refreshing the page. If that doesn\'t work, reach out on ')),
						githubLink,
						$elm$html$Html$text('.')
					]));
		case 2:
			var msg = err.a;
			return A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Error decoding JSON. You can try refreshing the page, but it\'s probably a bug. Please reach out on '),
						githubLink,
						$elm$html$Html$text('.')
					]));
		case 1:
			var msg = err.a;
			return A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Error parsing API response: ' + (msg + '. This is typically due to server load. Refresh the page, and if that doesn\'t work, reach out on ')),
						githubLink,
						$elm$html$Html$text('.')
					]));
		case 3:
			var msg = err.a;
			return A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Error in the API: ' + (msg + '. You can try refreshing the page, but it\'s probably a bug. Please reach out on ')),
						githubLink,
						$elm$html$Html$text('.')
					]));
		default:
			var msg = err.a;
			return A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('User Error: ' + (msg + '. You can refresh the page or retry whatever you were doing. Please reach out on ')),
						githubLink,
						$elm$html$Html$text(' if you cannot resolve it.')
					]));
	}
};
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $author$project$Semseg$viewErr = function (err) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('relative rounded-lg border border-red-200 bg-red-50 p-4 m-4')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('font-bold text-red-800')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Error')
					])),
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('text-red-700')
					]),
				_List_fromArray(
					[
						$author$project$Semseg$explainGradioError(err)
					]))
			]));
};
var $author$project$Semseg$HoverPatch = function (a) {
	return {$: 4, a: a};
};
var $author$project$Semseg$ResetHoveredPatch = {$: 5};
var $author$project$Semseg$ToggleSelectedPatch = function (a) {
	return {$: 6, a: a};
};
var $elm$html$Html$Events$onMouseEnter = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseenter',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Events$onMouseLeave = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseleave',
		$elm$json$Json$Decode$succeed(msg));
};
var $author$project$Semseg$viewGridCell = F3(
	function (hovered, selected, self) {
		var classes = _Utils_ap(
			function () {
				if (!hovered.$) {
					var h = hovered.a;
					return _Utils_eq(h, self) ? _List_fromArray(
						['border-2 border-rose-600 border-dashed']) : _List_Nil;
				} else {
					return _List_Nil;
				}
			}(),
			A2($elm$core$Set$member, self, selected) ? _List_fromArray(
				['bg-rose-600/50']) : _List_Nil);
		return A2(
			$elm$html$Html$div,
			_Utils_ap(
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('w-[14px] h-[14px] sm:w-[21px] sm:h-[21px]'),
						$elm$html$Html$Events$onMouseEnter(
						$author$project$Semseg$HoverPatch(self)),
						$elm$html$Html$Events$onMouseLeave($author$project$Semseg$ResetHoveredPatch),
						$elm$html$Html$Events$onClick(
						$author$project$Semseg$ToggleSelectedPatch(self))
					]),
				A2($elm$core$List$map, $elm$html$Html$Attributes$class, classes)),
			_List_Nil);
	});
var $elm$svg$Svg$Attributes$class = _VirtualDom_attribute('class');
var $elm$svg$Svg$Attributes$d = _VirtualDom_attribute('d');
var $elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$path = $elm$svg$Svg$trustedNode('path');
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var $author$project$Semseg$viewSpinner = function (text) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('flex flex-row items-center gap-2')
			]),
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$svg,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$class('w-8 h-8 text-gray-200 fill-blue-600 animate-spin'),
						$elm$svg$Svg$Attributes$viewBox('0 0 100 101'),
						$elm$svg$Svg$Attributes$fill('none')
					]),
				_List_fromArray(
					[
						A2(
						$elm$svg$Svg$path,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$d('M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'),
								$elm$svg$Svg$Attributes$fill('currentColor')
							]),
						_List_Nil),
						A2(
						$elm$svg$Svg$path,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$d('M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'),
								$elm$svg$Svg$Attributes$fill('currentFill')
							]),
						_List_Nil)
					])),
				A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('italic text-gray-600')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(text)
					]))
			]));
};
var $author$project$Semseg$viewGriddedImage = F4(
	function (model, reqImage, title, callToAction) {
		switch (reqImage.$) {
			case 0:
				return A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('text-center')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('text-center')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(title)
								])),
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('italic')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(callToAction)
								]))
						]));
			case 1:
				return A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('text-center')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('text-center')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(title)
								])),
							$author$project$Semseg$viewSpinner('Loading')
						]));
			case 3:
				var err = reqImage.a;
				return $author$project$Semseg$viewErr(err);
			default:
				var image = reqImage.a;
				return A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('text-center')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('flex flex-row justify-center items-center gap-1')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(title)
										])),
									A2(
									$elm$html$Html$a,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$href(
											$author$project$Gradio$base64ImageToString(image)),
											$elm$html$Html$Attributes$target('_blank'),
											$elm$html$Html$Attributes$rel('noopener noreferrer'),
											$elm$html$Html$Attributes$class('text-blue-600 underline text-sm italic')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Open Image')
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('relative inline-block')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('absolute grid'),
											$elm$html$Html$Attributes$class('grid-rows-[repeat(16,_14px)] grid-cols-[repeat(16,_14px)]'),
											$elm$html$Html$Attributes$class('xs:grid-rows-[repeat(16,_21px)] xs:grid-cols-[repeat(16,_21px)]')
										]),
									A2(
										$elm$core$List$map,
										A2($author$project$Semseg$viewGridCell, model.U, model.p),
										A2($elm$core$List$range, 0, 255))),
									A2(
									$elm$html$Html$img,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('block'),
											$elm$html$Html$Attributes$class('w-[224px] h-[224px]'),
											$elm$html$Html$Attributes$class('xs:w-[336px] xs:h-[336px]'),
											$elm$html$Html$Attributes$src(
											$author$project$Gradio$base64ImageToString(image)),
											A2($elm$html$Html$Attributes$style, 'image-rendering', 'pixelated')
										]),
									_List_Nil)
								]))
						]));
		}
	});
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $elm$html$Html$details = _VirtualDom_node('details');
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $author$project$Semseg$Examples$image1099 = A2(
	$elm$core$Maybe$withDefault,
	$author$project$Gradio$base64ImageEmpty,
	$author$project$Gradio$base64Image('data:image/webp;base64,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'));
var $author$project$Semseg$Examples$image1117 = A2(
	$elm$core$Maybe$withDefault,
	$author$project$Gradio$base64ImageEmpty,
	$author$project$Gradio$base64Image('data:image/webp;base64,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'));
var $author$project$Semseg$Examples$image1633 = A2(
	$elm$core$Maybe$withDefault,
	$author$project$Gradio$base64ImageEmpty,
	$author$project$Gradio$base64Image('data:image/webp;base64,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'));
var $author$project$Semseg$Examples$image1872 = A2(
	$elm$core$Maybe$withDefault,
	$author$project$Gradio$base64ImageEmpty,
	$author$project$Gradio$base64Image('data:image/webp;base64,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'));
var $author$project$Semseg$guidedExamples = _List_fromArray(
	[
		{
		D: 'Instead, only the \'car, auto\' (class 21) class is removed. Other predictions, like the buildings, are unchanged.',
		E: A2(
			$elm$html$Html$span,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('For example, try selecting a couple patches over the car in the bottom left corner. You might see the '),
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('font-mono')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('DINOv2-24K/7235')
						])),
					$elm$html$Html$text(' SAE feature.')
				])),
		h: $author$project$Semseg$Examples$image1872,
		o: 1872,
		K: -6
	},
		{
		D: 'Instead, only the \'painting, picture\' (class 23) class is removed. Other predictions, like the floor, are unchanged.',
		E: A2(
			$elm$html$Html$span,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('For example, try selecting the patches for the painting in the middle of the wall. You might see the '),
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('font-mono')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('DINOv2-24K/16446')
						])),
					$elm$html$Html$text(' SAE feature.')
				])),
		h: $author$project$Semseg$Examples$image1633,
		o: 1633,
		K: -5
	},
		{
		D: 'Instead, only the \'toilet, can\' (class 66) class is removed. Other predictions, like the floor, are unchanged.',
		E: A2(
			$elm$html$Html$span,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('For example, try selecting the patches for the toilet. You might see the '),
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('font-mono')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('DINOv2-24K/5876')
						])),
					$elm$html$Html$text(' or '),
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('font-mono')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('DINOv2-24K/10875')
						])),
					$elm$html$Html$text(' SAE features.')
				])),
		h: $author$project$Semseg$Examples$image1099,
		o: 1099,
		K: -2
	},
		{
		D: 'Instead, only the \'bed\' (class 8) class is removed. Other predictions, like the painting, are unchanged.',
		E: A2(
			$elm$html$Html$span,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('For example, try selecting the patches for the bed cover in the middle of the image. You might see the '),
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('font-mono')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('DINOv2-24K/18834')
						])),
					$elm$html$Html$text(' SAE feature.')
				])),
		h: $author$project$Semseg$Examples$image1117,
		o: 1117,
		K: -2
	}
	]);
var $elm$html$Html$li = _VirtualDom_node('li');
var $author$project$Semseg$missingGuidedExample = {
	D: '',
	E: $elm$html$Html$text(''),
	h: $author$project$Gradio$base64ImageEmpty,
	o: -1,
	K: -8
};
var $elm$html$Html$ol = _VirtualDom_node('ol');
var $elm$html$Html$summary = _VirtualDom_node('summary');
var $author$project$Semseg$viewGuidedExampleButton = function (example) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('w-full md:w-36 flex flex-col space-y-1')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$img,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$src(
						$author$project$Gradio$base64ImageToString(example.h)),
						$elm$html$Html$Events$onClick(
						$author$project$Semseg$SetUrl(example.o)),
						$elm$html$Html$Attributes$class('cursor-pointer')
					]),
				_List_Nil),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick(
						$author$project$Semseg$SetUrl(example.o)),
						$elm$html$Html$Attributes$class('flex-1 rounded-lg px-2 py-1 transition-colors'),
						$elm$html$Html$Attributes$class('border border-sky-300 hover:border-sky-400'),
						$elm$html$Html$Attributes$class('bg-sky-100 hover:bg-sky-200'),
						$elm$html$Html$Attributes$class('text-gray-700 hover:text-gray-900'),
						$elm$html$Html$Attributes$class('focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2'),
						$elm$html$Html$Attributes$class('active:bg-gray-300')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						'Example #' + $elm$core$String$fromInt(example.o))
					]))
			]));
};
var $author$project$Semseg$viewInstructions = function (current) {
	var guided = function () {
		if (current.$ === 2) {
			var example = current.a;
			return A2(
				$elm$core$Maybe$withDefault,
				$author$project$Semseg$missingGuidedExample,
				$elm$core$List$head(
					A2(
						$elm$core$List$filter,
						function (g) {
							return _Utils_eq(example.h, g.h);
						},
						$author$project$Semseg$guidedExamples)));
		} else {
			return $author$project$Semseg$missingGuidedExample;
		}
	}();
	return A2(
		$elm$html$Html$details,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$attribute, 'open', '')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$summary,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('cursor-pointer font-bold text-l')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Instructions')
							])),
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('cursor-pointer italic')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(' (click to toggle)')
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('md:flex md:gap-6')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$ol,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('list-decimal pl-4 space-y-1 md:flex-1')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$li,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Click any example to see a DINOv2-powered segmentation.')
									])),
								A2(
								$elm$html$Html$li,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Can you selectively modify how the model interprets just one semantic element?')
									])),
								A2(
								$elm$html$Html$li,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Click on all the patches for a given concept and observe which SAE feature are most activated by these patches. '),
										guided.E
									])),
								A2(
								$elm$html$Html$li,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(
										'Test for feature independence: suppress this feature across ALL patches in the entire image by changing the slider to ' + ($elm$core$String$fromInt(guided.K) + '.'))
									])),
								A2(
								$elm$html$Html$li,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('If SAE features were not pseudo-orthogonal, this global modification would cause widespread disruption.' + guided.D)
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('grid grid-cols-2 sm:grid-cols-4 md:inline-grid md:grid-cols-2 md:items-start xl:grid-cols-4'),
								$elm$html$Html$Attributes$class('gap-1 mt-4 md:mt-0')
							]),
						A2($elm$core$List$map, $author$project$Semseg$viewGuidedExampleButton, $author$project$Semseg$guidedExamples))
					]))
			]));
};
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$core$List$sortBy = _List_sortBy;
var $elm$core$List$sort = function (xs) {
	return A2($elm$core$List$sortBy, $elm$core$Basics$identity, xs);
};
var $elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, list);
			var jsArray = _v0.a;
			var remainingItems = _v0.b;
			if (_Utils_cmp(
				$elm$core$Elm$JsArray$length(jsArray),
				$elm$core$Array$branchFactor) < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					true,
					{i: nodeList, e: nodeListSize, g: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					$elm$core$List$cons,
					$elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var $elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return $elm$core$Array$empty;
	} else {
		return A3($elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var $author$project$Semseg$classnames = $elm$core$Array$fromList(
	_List_fromArray(
		[
			_List_fromArray(
			['wall']),
			_List_fromArray(
			['building', 'edifice']),
			_List_fromArray(
			['sky']),
			_List_fromArray(
			['floor', 'flooring']),
			_List_fromArray(
			['tree']),
			_List_fromArray(
			['ceiling']),
			_List_fromArray(
			['road', 'route']),
			_List_fromArray(
			['bed']),
			_List_fromArray(
			['windowpane', 'window']),
			_List_fromArray(
			['grass']),
			_List_fromArray(
			['cabinet']),
			_List_fromArray(
			['sidewalk', 'pavement']),
			_List_fromArray(
			['person', 'individual']),
			_List_fromArray(
			['earth', 'ground']),
			_List_fromArray(
			['door', 'double door']),
			_List_fromArray(
			['table']),
			_List_fromArray(
			['mountain']),
			_List_fromArray(
			['plant', 'flora']),
			_List_fromArray(
			['curtain', 'drape']),
			_List_fromArray(
			['chair']),
			_List_fromArray(
			['car', 'auto']),
			_List_fromArray(
			['water']),
			_List_fromArray(
			['painting', 'picture']),
			_List_fromArray(
			['sofa', 'couch']),
			_List_fromArray(
			['shelf']),
			_List_fromArray(
			['house']),
			_List_fromArray(
			['sea']),
			_List_fromArray(
			['mirror']),
			_List_fromArray(
			['rug', 'carpet']),
			_List_fromArray(
			['field']),
			_List_fromArray(
			['armchair']),
			_List_fromArray(
			['seat']),
			_List_fromArray(
			['fence', 'fencing']),
			_List_fromArray(
			['desk']),
			_List_fromArray(
			['rock', 'stone']),
			_List_fromArray(
			['wardrobe', 'closet']),
			_List_fromArray(
			['lamp']),
			_List_fromArray(
			['bathtub', 'bathing tub']),
			_List_fromArray(
			['railing', 'rail']),
			_List_fromArray(
			['cushion']),
			_List_fromArray(
			['base', 'pedestal']),
			_List_fromArray(
			['box']),
			_List_fromArray(
			['column', 'pillar']),
			_List_fromArray(
			['signboard', 'sign']),
			_List_fromArray(
			['chest of drawers', 'chest']),
			_List_fromArray(
			['counter']),
			_List_fromArray(
			['sand']),
			_List_fromArray(
			['sink']),
			_List_fromArray(
			['skyscraper']),
			_List_fromArray(
			['fireplace', 'hearth']),
			_List_fromArray(
			['refrigerator', 'icebox']),
			_List_fromArray(
			['grandstand', 'covered stand']),
			_List_fromArray(
			['path']),
			_List_fromArray(
			['stairs', 'steps']),
			_List_fromArray(
			['runway']),
			_List_fromArray(
			['case', 'display case']),
			_List_fromArray(
			['pool table', 'billiard table']),
			_List_fromArray(
			['pillow']),
			_List_fromArray(
			['screen door', 'screen']),
			_List_fromArray(
			['stairway', 'staircase']),
			_List_fromArray(
			['river']),
			_List_fromArray(
			['bridge', 'span']),
			_List_fromArray(
			['bookcase']),
			_List_fromArray(
			['blind', 'screen']),
			_List_fromArray(
			['coffee table', 'cocktail table']),
			_List_fromArray(
			['toilet', 'can']),
			_List_fromArray(
			['flower']),
			_List_fromArray(
			['book']),
			_List_fromArray(
			['hill']),
			_List_fromArray(
			['bench']),
			_List_fromArray(
			['countertop']),
			_List_fromArray(
			['stove', 'kitchen stove']),
			_List_fromArray(
			['palm', 'palm tree']),
			_List_fromArray(
			['kitchen island']),
			_List_fromArray(
			['computer', 'computing machine']),
			_List_fromArray(
			['swivel chair']),
			_List_fromArray(
			['boat']),
			_List_fromArray(
			['bar']),
			_List_fromArray(
			['arcade machine']),
			_List_fromArray(
			['hovel', 'hut']),
			_List_fromArray(
			['bus', 'autobus']),
			_List_fromArray(
			['towel']),
			_List_fromArray(
			['light', 'light source']),
			_List_fromArray(
			['truck', 'motortruck']),
			_List_fromArray(
			['tower']),
			_List_fromArray(
			['chandelier', 'pendant']),
			_List_fromArray(
			['awning', 'sunshade']),
			_List_fromArray(
			['streetlight', 'street lamp']),
			_List_fromArray(
			['booth', 'cubicle']),
			_List_fromArray(
			['television receiver', 'television']),
			_List_fromArray(
			['airplane', 'aeroplane']),
			_List_fromArray(
			['dirt track']),
			_List_fromArray(
			['apparel', 'wearing apparel']),
			_List_fromArray(
			['pole']),
			_List_fromArray(
			['land', 'ground']),
			_List_fromArray(
			['bannister', 'banister']),
			_List_fromArray(
			['escalator', 'moving staircase']),
			_List_fromArray(
			['ottoman', 'pouf']),
			_List_fromArray(
			['bottle']),
			_List_fromArray(
			['buffet', 'counter']),
			_List_fromArray(
			['poster', 'posting']),
			_List_fromArray(
			['stage']),
			_List_fromArray(
			['van']),
			_List_fromArray(
			['ship']),
			_List_fromArray(
			['fountain']),
			_List_fromArray(
			['conveyer belt', 'conveyor belt']),
			_List_fromArray(
			['canopy']),
			_List_fromArray(
			['washer', 'automatic washer']),
			_List_fromArray(
			['plaything', 'toy']),
			_List_fromArray(
			['swimming pool', 'swimming bath']),
			_List_fromArray(
			['stool']),
			_List_fromArray(
			['barrel', 'cask']),
			_List_fromArray(
			['basket', 'handbasket']),
			_List_fromArray(
			['waterfall', 'falls']),
			_List_fromArray(
			['tent', 'collapsible shelter']),
			_List_fromArray(
			['bag']),
			_List_fromArray(
			['minibike', 'motorbike']),
			_List_fromArray(
			['cradle']),
			_List_fromArray(
			['oven']),
			_List_fromArray(
			['ball']),
			_List_fromArray(
			['food', 'solid food']),
			_List_fromArray(
			['step', 'stair']),
			_List_fromArray(
			['tank', 'storage tank']),
			_List_fromArray(
			['trade name', 'brand name']),
			_List_fromArray(
			['microwave', 'microwave oven']),
			_List_fromArray(
			['pot', 'flowerpot']),
			_List_fromArray(
			['animal', 'animate being']),
			_List_fromArray(
			['bicycle', 'bike']),
			_List_fromArray(
			['lake']),
			_List_fromArray(
			['dishwasher', 'dish washer']),
			_List_fromArray(
			['screen', 'silver screen']),
			_List_fromArray(
			['blanket', 'cover']),
			_List_fromArray(
			['sculpture']),
			_List_fromArray(
			['hood', 'exhaust hood']),
			_List_fromArray(
			['sconce']),
			_List_fromArray(
			['vase']),
			_List_fromArray(
			['traffic light', 'traffic signal']),
			_List_fromArray(
			['tray']),
			_List_fromArray(
			['ashcan', 'trash can']),
			_List_fromArray(
			['fan']),
			_List_fromArray(
			['pier', 'wharf']),
			_List_fromArray(
			['crt screen']),
			_List_fromArray(
			['plate']),
			_List_fromArray(
			['monitor', 'monitoring device']),
			_List_fromArray(
			['bulletin board', 'notice board']),
			_List_fromArray(
			['shower']),
			_List_fromArray(
			['radiator']),
			_List_fromArray(
			['glass', 'drinking glass']),
			_List_fromArray(
			['clock']),
			_List_fromArray(
			['flag'])
		]));
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Elm$JsArray$unsafeSet = _JsArray_unsafeSet;
var $elm$core$Array$setHelp = F4(
	function (shift, index, value, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
		if (!_v0.$) {
			var subTree = _v0.a;
			var newSub = A4($elm$core$Array$setHelp, shift - $elm$core$Array$shiftStep, index, value, subTree);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$SubTree(newSub),
				tree);
		} else {
			var values = _v0.a;
			var newLeaf = A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, values);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$Leaf(newLeaf),
				tree);
		}
	});
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$set = F3(
	function (index, value, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? array : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			tree,
			A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, tail)) : A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			A4($elm$core$Array$setHelp, startShift, index, value, tree),
			tail));
	});
var $author$project$Semseg$colors = A3(
	$elm$core$Array$set,
	94,
	_Utils_Tuple3(12, 15, 10),
	A3(
		$elm$core$Array$set,
		72,
		_Utils_Tuple3(76, 46, 5),
		A3(
			$elm$core$Array$set,
			60,
			_Utils_Tuple3(72, 99, 156),
			A3(
				$elm$core$Array$set,
				46,
				_Utils_Tuple3(238, 185, 2),
				A3(
					$elm$core$Array$set,
					29,
					_Utils_Tuple3(116, 142, 84),
					A3(
						$elm$core$Array$set,
						26,
						_Utils_Tuple3(45, 125, 210),
						A3(
							$elm$core$Array$set,
							21,
							_Utils_Tuple3(120, 202, 210),
							A3(
								$elm$core$Array$set,
								16,
								_Utils_Tuple3(54, 48, 32),
								A3(
									$elm$core$Array$set,
									4,
									_Utils_Tuple3(151, 204, 4),
									A3(
										$elm$core$Array$set,
										2,
										_Utils_Tuple3(201, 249, 255),
										$elm$core$Array$fromList(
											_List_fromArray(
												[
													_Utils_Tuple3(51, 0, 0),
													_Utils_Tuple3(204, 0, 102),
													_Utils_Tuple3(0, 255, 0),
													_Utils_Tuple3(102, 51, 51),
													_Utils_Tuple3(153, 204, 51),
													_Utils_Tuple3(51, 51, 153),
													_Utils_Tuple3(102, 0, 51),
													_Utils_Tuple3(153, 153, 0),
													_Utils_Tuple3(51, 102, 204),
													_Utils_Tuple3(204, 255, 0),
													_Utils_Tuple3(204, 102, 0),
													_Utils_Tuple3(204, 255, 153),
													_Utils_Tuple3(102, 102, 255),
													_Utils_Tuple3(255, 204, 255),
													_Utils_Tuple3(51, 255, 0),
													_Utils_Tuple3(0, 102, 51),
													_Utils_Tuple3(102, 102, 0),
													_Utils_Tuple3(0, 0, 255),
													_Utils_Tuple3(255, 153, 204),
													_Utils_Tuple3(204, 204, 0),
													_Utils_Tuple3(0, 153, 153),
													_Utils_Tuple3(153, 102, 204),
													_Utils_Tuple3(255, 204, 0),
													_Utils_Tuple3(204, 204, 153),
													_Utils_Tuple3(255, 51, 0),
													_Utils_Tuple3(51, 51, 0),
													_Utils_Tuple3(153, 51, 51),
													_Utils_Tuple3(0, 0, 102),
													_Utils_Tuple3(102, 255, 204),
													_Utils_Tuple3(204, 51, 255),
													_Utils_Tuple3(255, 204, 204),
													_Utils_Tuple3(0, 0, 153),
													_Utils_Tuple3(0, 102, 153),
													_Utils_Tuple3(153, 0, 51),
													_Utils_Tuple3(51, 51, 102),
													_Utils_Tuple3(255, 153, 0),
													_Utils_Tuple3(204, 153, 0),
													_Utils_Tuple3(153, 102, 153),
													_Utils_Tuple3(51, 204, 204),
													_Utils_Tuple3(51, 51, 255),
													_Utils_Tuple3(153, 204, 102),
													_Utils_Tuple3(102, 204, 153),
													_Utils_Tuple3(153, 153, 204),
													_Utils_Tuple3(0, 51, 204),
													_Utils_Tuple3(204, 204, 102),
													_Utils_Tuple3(0, 51, 153),
													_Utils_Tuple3(0, 102, 0),
													_Utils_Tuple3(51, 0, 102),
													_Utils_Tuple3(153, 255, 0),
													_Utils_Tuple3(153, 255, 102),
													_Utils_Tuple3(102, 102, 51),
													_Utils_Tuple3(153, 0, 255),
													_Utils_Tuple3(204, 255, 102),
													_Utils_Tuple3(102, 0, 255),
													_Utils_Tuple3(255, 204, 153),
													_Utils_Tuple3(102, 51, 0),
													_Utils_Tuple3(102, 204, 102),
													_Utils_Tuple3(0, 102, 204),
													_Utils_Tuple3(51, 204, 0),
													_Utils_Tuple3(255, 102, 102),
													_Utils_Tuple3(153, 255, 204),
													_Utils_Tuple3(51, 204, 51),
													_Utils_Tuple3(0, 0, 0),
													_Utils_Tuple3(255, 0, 255),
													_Utils_Tuple3(153, 0, 153),
													_Utils_Tuple3(255, 204, 51),
													_Utils_Tuple3(51, 0, 51),
													_Utils_Tuple3(102, 204, 255),
													_Utils_Tuple3(153, 204, 153),
													_Utils_Tuple3(153, 102, 0),
													_Utils_Tuple3(102, 204, 204),
													_Utils_Tuple3(204, 204, 204),
													_Utils_Tuple3(255, 0, 0),
													_Utils_Tuple3(255, 255, 51),
													_Utils_Tuple3(0, 255, 102),
													_Utils_Tuple3(204, 153, 102),
													_Utils_Tuple3(204, 153, 153),
													_Utils_Tuple3(102, 51, 153),
													_Utils_Tuple3(51, 102, 0),
													_Utils_Tuple3(204, 51, 153),
													_Utils_Tuple3(153, 51, 255),
													_Utils_Tuple3(102, 0, 204),
													_Utils_Tuple3(204, 102, 153),
													_Utils_Tuple3(204, 0, 204),
													_Utils_Tuple3(102, 51, 102),
													_Utils_Tuple3(0, 153, 51),
													_Utils_Tuple3(153, 153, 51),
													_Utils_Tuple3(255, 102, 0),
													_Utils_Tuple3(255, 153, 153),
													_Utils_Tuple3(153, 0, 102),
													_Utils_Tuple3(51, 204, 255),
													_Utils_Tuple3(102, 255, 102),
													_Utils_Tuple3(255, 255, 204),
													_Utils_Tuple3(51, 51, 204),
													_Utils_Tuple3(153, 102, 51),
													_Utils_Tuple3(153, 153, 255),
													_Utils_Tuple3(51, 153, 0),
													_Utils_Tuple3(204, 0, 255),
													_Utils_Tuple3(102, 255, 0),
													_Utils_Tuple3(153, 102, 255),
													_Utils_Tuple3(204, 102, 255),
													_Utils_Tuple3(204, 0, 0),
													_Utils_Tuple3(102, 153, 255),
													_Utils_Tuple3(204, 102, 204),
													_Utils_Tuple3(204, 51, 102),
													_Utils_Tuple3(0, 255, 153),
													_Utils_Tuple3(153, 204, 204),
													_Utils_Tuple3(255, 0, 102),
													_Utils_Tuple3(102, 51, 204),
													_Utils_Tuple3(255, 51, 204),
													_Utils_Tuple3(51, 204, 153),
													_Utils_Tuple3(153, 153, 102),
													_Utils_Tuple3(153, 204, 0),
													_Utils_Tuple3(153, 102, 102),
													_Utils_Tuple3(204, 153, 255),
													_Utils_Tuple3(153, 0, 204),
													_Utils_Tuple3(102, 0, 0),
													_Utils_Tuple3(255, 51, 255),
													_Utils_Tuple3(0, 204, 153),
													_Utils_Tuple3(255, 153, 51),
													_Utils_Tuple3(0, 255, 204),
													_Utils_Tuple3(51, 102, 153),
													_Utils_Tuple3(255, 51, 51),
													_Utils_Tuple3(102, 255, 51),
													_Utils_Tuple3(0, 0, 204),
													_Utils_Tuple3(102, 255, 153),
													_Utils_Tuple3(0, 204, 255),
													_Utils_Tuple3(0, 102, 102),
													_Utils_Tuple3(102, 51, 255),
													_Utils_Tuple3(255, 0, 204),
													_Utils_Tuple3(51, 255, 153),
													_Utils_Tuple3(204, 0, 51),
													_Utils_Tuple3(153, 51, 204),
													_Utils_Tuple3(204, 102, 51),
													_Utils_Tuple3(255, 255, 0),
													_Utils_Tuple3(51, 51, 51),
													_Utils_Tuple3(0, 153, 0),
													_Utils_Tuple3(51, 255, 102),
													_Utils_Tuple3(51, 102, 255),
													_Utils_Tuple3(102, 153, 0),
													_Utils_Tuple3(102, 153, 204),
													_Utils_Tuple3(51, 0, 255),
													_Utils_Tuple3(102, 153, 153),
													_Utils_Tuple3(153, 51, 102),
													_Utils_Tuple3(204, 255, 51),
													_Utils_Tuple3(204, 204, 51),
													_Utils_Tuple3(0, 204, 51),
													_Utils_Tuple3(255, 102, 153),
													_Utils_Tuple3(204, 102, 102),
													_Utils_Tuple3(102, 0, 102),
													_Utils_Tuple3(51, 153, 204),
													_Utils_Tuple3(255, 255, 255),
													_Utils_Tuple3(0, 102, 255),
													_Utils_Tuple3(51, 102, 51),
													_Utils_Tuple3(204, 0, 153),
													_Utils_Tuple3(102, 153, 102),
													_Utils_Tuple3(102, 0, 153),
													_Utils_Tuple3(153, 255, 153),
													_Utils_Tuple3(0, 153, 102),
													_Utils_Tuple3(102, 204, 0),
													_Utils_Tuple3(0, 255, 51),
													_Utils_Tuple3(153, 204, 255),
													_Utils_Tuple3(153, 51, 153),
													_Utils_Tuple3(0, 51, 255),
													_Utils_Tuple3(51, 255, 51),
													_Utils_Tuple3(255, 102, 51),
													_Utils_Tuple3(102, 102, 204),
													_Utils_Tuple3(102, 153, 51),
													_Utils_Tuple3(0, 204, 0),
													_Utils_Tuple3(102, 204, 51),
													_Utils_Tuple3(255, 102, 255),
													_Utils_Tuple3(255, 204, 102),
													_Utils_Tuple3(102, 102, 102),
													_Utils_Tuple3(255, 102, 204),
													_Utils_Tuple3(51, 0, 153),
													_Utils_Tuple3(255, 0, 51),
													_Utils_Tuple3(102, 102, 153),
													_Utils_Tuple3(255, 153, 102),
													_Utils_Tuple3(204, 255, 204),
													_Utils_Tuple3(51, 0, 204),
													_Utils_Tuple3(0, 0, 51),
													_Utils_Tuple3(51, 255, 255),
													_Utils_Tuple3(204, 51, 0),
													_Utils_Tuple3(153, 51, 0),
													_Utils_Tuple3(51, 153, 102),
													_Utils_Tuple3(102, 255, 255),
													_Utils_Tuple3(255, 153, 255),
													_Utils_Tuple3(204, 255, 255),
													_Utils_Tuple3(204, 153, 204),
													_Utils_Tuple3(255, 0, 153),
													_Utils_Tuple3(51, 102, 102),
													_Utils_Tuple3(153, 255, 255),
													_Utils_Tuple3(255, 255, 153),
													_Utils_Tuple3(204, 51, 204),
													_Utils_Tuple3(153, 153, 153),
													_Utils_Tuple3(51, 153, 255),
													_Utils_Tuple3(51, 153, 51),
													_Utils_Tuple3(0, 153, 255),
													_Utils_Tuple3(0, 51, 51),
													_Utils_Tuple3(0, 51, 102),
													_Utils_Tuple3(153, 0, 0),
													_Utils_Tuple3(204, 51, 51),
													_Utils_Tuple3(0, 153, 204),
													_Utils_Tuple3(153, 255, 51),
													_Utils_Tuple3(255, 255, 102),
													_Utils_Tuple3(204, 204, 255),
													_Utils_Tuple3(0, 204, 102),
													_Utils_Tuple3(255, 51, 102),
													_Utils_Tuple3(0, 255, 255),
													_Utils_Tuple3(51, 153, 153),
													_Utils_Tuple3(51, 204, 102),
													_Utils_Tuple3(51, 255, 204),
													_Utils_Tuple3(255, 51, 153),
													_Utils_Tuple3(0, 51, 0),
													_Utils_Tuple3(0, 204, 204),
													_Utils_Tuple3(204, 153, 51)
												]))))))))))));
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!_v0.$) {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $author$project$Semseg$viewClassIcon = function (cls) {
	var color = function () {
		var _v1 = A2($elm$core$Array$get, cls - 1, $author$project$Semseg$colors);
		if (!_v1.$) {
			var _v2 = _v1.a;
			var r = _v2.a;
			var g = _v2.b;
			var b = _v2.c;
			return 'rgb(' + ($elm$core$String$fromInt(r) + (' ' + ($elm$core$String$fromInt(g) + (' ' + ($elm$core$String$fromInt(b) + ')')))));
		} else {
			return 'red';
		}
	}();
	var classname = function () {
		var _v0 = A2($elm$core$Array$get, cls - 1, $author$project$Semseg$classnames);
		if (!_v0.$) {
			var names = _v0.a;
			return A2(
				$elm$core$String$join,
				', ',
				A2($elm$core$List$take, 2, names));
		} else {
			return 'no classname found';
		}
	}();
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('flex flex-row gap-1 items-center')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('w-4 h-4'),
						A2($elm$html$Html$Attributes$style, 'background-color', color)
					]),
				_List_Nil),
				A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(
						classname + (' (class ' + ($elm$core$String$fromInt(cls) + ')')))
					]))
			]));
};
var $author$project$Semseg$viewLegend = function (classes) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('legend')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('font-bold text-l')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Legend')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-4')
					]),
				A2(
					$elm$core$List$map,
					$author$project$Semseg$viewClassIcon,
					A2(
						$elm$core$List$filter,
						function (x) {
							return x > 0;
						},
						$elm$core$List$sort(
							$elm$core$Set$toList(classes)))))
			]));
};
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$core$Maybe$map2 = F3(
	function (func, ma, mb) {
		if (ma.$ === 1) {
			return $elm$core$Maybe$Nothing;
		} else {
			var a = ma.a;
			if (mb.$ === 1) {
				return $elm$core$Maybe$Nothing;
			} else {
				var b = mb.a;
				return $elm$core$Maybe$Just(
					A2(func, a, b));
			}
		}
	});
var $author$project$Semseg$SetSlider = F2(
	function (a, b) {
		return {$: 8, a: a, b: b};
	});
var $author$project$Semseg$ToggleHighlights = function (a) {
	return {$: 9, a: a};
};
var $elm$core$String$fromFloat = _String_fromNumber;
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$label = _VirtualDom_node('label');
var $elm$html$Html$Attributes$max = $elm$html$Html$Attributes$stringProperty('max');
var $elm$html$Html$Attributes$min = $elm$html$Html$Attributes$stringProperty('min');
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$Semseg$viewExample = function (img) {
	return A2(
		$elm$html$Html$img,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$src(
				$author$project$Gradio$base64ImageToString(img)),
				$elm$html$Html$Attributes$class('w-full h-auto')
			]),
		_List_Nil);
};
var $author$project$Semseg$viewSliderValue = function (value) {
	return (value > 0) ? ('+' + $elm$core$String$fromFloat(value)) : $elm$core$String$fromFloat(value);
};
var $elm$html$Html$Attributes$checked = $elm$html$Html$Attributes$boolProperty('checked');
var $author$project$Semseg$viewToggle = F3(
	function (text, active, onToggle) {
		return A2(
			$elm$html$Html$label,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('inline-flex items-center cursor-pointer')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$input,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$type_('checkbox'),
							$elm$html$Html$Attributes$checked(active),
							$elm$html$Html$Events$onClick(onToggle),
							$elm$html$Html$Attributes$class('sr-only peer')
						]),
					_List_Nil),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('relative w-11 h-6 bg-gray-200 rounded-full peer '),
							$elm$html$Html$Attributes$class('peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300'),
							$elm$html$Html$Attributes$class('rtl:peer-checked:after:-translate-x-full'),
							$elm$html$Html$Attributes$class('after:content-[\'\'] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all'),
							$elm$html$Html$Attributes$class('dark:peer-focus:ring-blue-800 dark:bg-gray-700 dark:border-gray-600 dark:peer-checked:bg-blue-600'),
							$elm$html$Html$Attributes$class('peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:bg-blue-600')
						]),
					_List_Nil),
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('ms-3 text-sm font-medium text-gray-900 dark:text-gray-300')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(text)
						]))
				]));
	});
var $author$project$Semseg$viewSaeLatent = F3(
	function (latent, highlighted, value) {
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('grid grid-cols-4')
						]),
					A2(
						$elm$core$List$map,
						function (ex) {
							return highlighted ? $author$project$Semseg$viewExample(ex.aB) : $author$project$Semseg$viewExample(ex.h);
						},
						latent.au)),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('sm:flex sm:items-center sm:justify-between sm:space-x-3 sm:mt-1')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('inline-flex items-center')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$input,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$type_('range'),
											$elm$html$Html$Attributes$min('-10'),
											$elm$html$Html$Attributes$max('10'),
											$elm$html$Html$Attributes$value(
											$elm$core$String$fromFloat(value)),
											$elm$html$Html$Events$onInput(
											$author$project$Semseg$SetSlider(latent.z)),
											$elm$html$Html$Attributes$class('md:max-w-24 lg:max-w-36')
										]),
									_List_Nil),
									A2(
									$elm$html$Html$label,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('ms-3 text-sm font-medium text-gray-900 dark:text-gray-300')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('font-mono')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(
													'DINOv2-24K/' + $elm$core$String$fromInt(latent.z))
												])),
											$elm$html$Html$text(
											': ' + $author$project$Semseg$viewSliderValue(value))
										]))
								])),
							A3(
							$author$project$Semseg$viewToggle,
							'Highlights',
							highlighted,
							$author$project$Semseg$ToggleHighlights(latent.z))
						]))
				]));
	});
var $author$project$Semseg$viewSaeLatents = F3(
	function (requestedLatents, toggles, values) {
		switch (requestedLatents.$) {
			case 0:
				return A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('italic')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Click on the image above to find similar image patches using a '),
							A2(
							$elm$html$Html$a,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('sparse autoencoder (SAE)')
								])),
							$elm$html$Html$text('.')
						]));
			case 1:
				return $author$project$Semseg$viewSpinner('Loading similar patches');
			case 3:
				var err = requestedLatents.a;
				return $author$project$Semseg$viewErr(err);
			default:
				var latents = requestedLatents.a;
				return A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('grid grid-cols-1 gap-2 lg:grid-cols-2')
						]),
					A2(
						$elm$core$List$filterMap,
						function (latent) {
							return A3(
								$elm$core$Maybe$map2,
								$author$project$Semseg$viewSaeLatent(latent),
								A2($elm$core$Dict$get, latent.z, toggles),
								A2($elm$core$Dict$get, latent.z, values));
						},
						latents));
		}
	});
var $author$project$Semseg$view = function (model) {
	return {
		ap: _List_fromArray(
			[
				A2(
				$elm$html$Html$main_,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('w-full min-h-screen space-y-4 bg-gray-50 p-1 xs:p-2 lg:p-4')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h1,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('font-bold text-2xl')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('SAEs for Scientifically Rigorous Interpretation of Vision Models')
							])),
						$author$project$Semseg$viewInstructions(model.k),
						$author$project$Semseg$viewControls(model.ab),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('flex flex-col gap-1 lg:flex-row xl:flex-col')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('grid gap-1 md:grid-cols-[336px_336px] xl:grid-cols-[336px_336px_336px_336px]')
									]),
								_List_fromArray(
									[
										A4(
										$author$project$Semseg$viewGriddedImage,
										model,
										A2(
											$author$project$Requests$map,
											function ($) {
												return $.h;
											},
											model.k),
										'Input Image',
										'Wait just a second...'),
										A4(
										$author$project$Semseg$viewGriddedImage,
										model,
										A2(
											$author$project$Requests$map,
											function ($) {
												return $.N;
											},
											model.k),
										'True Labels',
										'Wait just a second...'),
										A4(
										$author$project$Semseg$viewGriddedImage,
										model,
										A2(
											$author$project$Requests$map,
											function ($) {
												return $.N;
											},
											model.w),
										'Predicted Segmentation',
										'Wait just a second...'),
										A4(
										$author$project$Semseg$viewGriddedImage,
										model,
										A2(
											$author$project$Requests$map,
											function ($) {
												return $.N;
											},
											model.r),
										'Modified Segmentation',
										$elm$core$Set$isEmpty(model.p) ? 'Click on the image to explain model predictions.' : 'Modify the ViT\'s representations using the sliders.')
									])),
								$author$project$Semseg$viewLegend(
								A2(
									$elm$core$Set$union,
									$author$project$Semseg$getClasses(model.r),
									A2(
										$elm$core$Set$union,
										$author$project$Semseg$getClasses(model.w),
										A2(
											$elm$core$Set$union,
											$author$project$Semseg$getClasses(model.k),
											$elm$core$Set$empty))))
							])),
						A3($author$project$Semseg$viewSaeLatents, model.u, model.Q, model.O)
					]))
			]),
		bw: 'Semantic Segmentation'
	};
};
var $author$project$Semseg$main = $elm$browser$Browser$application(
	{
		bi: $author$project$Semseg$init,
		bl: $author$project$Semseg$onUrlChange,
		bm: $author$project$Semseg$onUrlRequest,
		bv: function (model) {
			return $elm$core$Platform$Sub$none;
		},
		bx: $author$project$Semseg$update,
		by: $author$project$Semseg$view
	});
_Platform_export({'Semseg':{'init':$author$project$Semseg$main(
	$elm$json$Json$Decode$succeed(0))(0)}});}(this));