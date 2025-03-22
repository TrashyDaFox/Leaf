var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var __privateWrapper = (obj, member, setter, getter) => ({
  set _(value) {
    __privateSet(obj, member, value, setter);
  },
  get _() {
    return __privateGet(obj, member, getter);
  }
});

// scripts/pdb/underscore.js
var VERSION = "1.13.6";
var root = typeof self == "object" && self.self === self && self || typeof global == "object" && global.global === global && global || Function("return this")() || {};
var ArrayProto = Array.prototype, ObjProto = Object.prototype;
var SymbolProto = typeof Symbol !== "undefined" ? Symbol.prototype : null;
var push = ArrayProto.push, slice = ArrayProto.slice, toString = ObjProto.toString, hasOwnProperty = ObjProto.hasOwnProperty;
var supportsArrayBuffer = typeof ArrayBuffer !== "undefined", supportsDataView = typeof DataView !== "undefined";
var nativeIsArray = Array.isArray, nativeKeys = Object.keys, nativeCreate = Object.create, nativeIsView = supportsArrayBuffer && ArrayBuffer.isView;
var _isNaN = isNaN, _isFinite = isFinite;
var hasEnumBug = !{ toString: null }.propertyIsEnumerable("toString");
var nonEnumerableProps = [
  "valueOf",
  "isPrototypeOf",
  "toString",
  "propertyIsEnumerable",
  "hasOwnProperty",
  "toLocaleString"
];
var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
function restArguments(func, startIndex) {
  startIndex = startIndex == null ? func.length - 1 : +startIndex;
  return function () {
    var length = Math.max(arguments.length - startIndex, 0), rest2 = Array(length), index = 0;
    for (; index < length; index++) {
      rest2[index] = arguments[index + startIndex];
    }
    switch (startIndex) {
      case 0:
        return func.call(this, rest2);
      case 1:
        return func.call(this, arguments[0], rest2);
      case 2:
        return func.call(this, arguments[0], arguments[1], rest2);
    }
    var args = Array(startIndex + 1);
    for (index = 0; index < startIndex; index++) {
      args[index] = arguments[index];
    }
    args[startIndex] = rest2;
    return func.apply(this, args);
  };
}
function isObject(obj) {
  var type = typeof obj;
  return type === "function" || type === "object" && !!obj;
}
function isNull(obj) {
  return obj === null;
}
function isUndefined(obj) {
  return obj === void 0;
}
function isBoolean(obj) {
  return obj === true || obj === false || toString.call(obj) === "[object Boolean]";
}
function isElement(obj) {
  return !!(obj && obj.nodeType === 1);
}
function tagTester(name) {
  var tag = "[object " + name + "]";
  return function (obj) {
    return toString.call(obj) === tag;
  };
}
var isString = tagTester("String");
var isNumber = tagTester("Number");
var isDate = tagTester("Date");
var isRegExp = tagTester("RegExp");
var isError = tagTester("Error");
var isSymbol = tagTester("Symbol");
var isArrayBuffer = tagTester("ArrayBuffer");
var isFunction = tagTester("Function");
var nodelist = root.document && root.document.childNodes;
if (typeof /./ != "function" && typeof Int8Array != "object" && typeof nodelist != "function") {
  isFunction = function (obj) {
    return typeof obj == "function" || false;
  };
}
var isFunction$1 = isFunction;
var hasObjectTag = tagTester("Object");
var hasStringTagBug = supportsDataView && hasObjectTag(new DataView(new ArrayBuffer(8))), isIE11 = typeof Map !== "undefined" && hasObjectTag(/* @__PURE__ */ new Map());
var isDataView = tagTester("DataView");
function ie10IsDataView(obj) {
  return obj != null && isFunction$1(obj.getInt8) && isArrayBuffer(obj.buffer);
}
var isDataView$1 = hasStringTagBug ? ie10IsDataView : isDataView;
var isArray = nativeIsArray || tagTester("Array");
function has$1(obj, key) {
  return obj != null && hasOwnProperty.call(obj, key);
}
var isArguments = tagTester("Arguments");
(function () {
  if (!isArguments(arguments)) {
    isArguments = function (obj) {
      return has$1(obj, "callee");
    };
  }
})();
var isArguments$1 = isArguments;
function isFinite$1(obj) {
  return !isSymbol(obj) && _isFinite(obj) && !isNaN(parseFloat(obj));
}
function isNaN$1(obj) {
  return isNumber(obj) && _isNaN(obj);
}
function constant(value) {
  return function () {
    return value;
  };
}
function createSizePropertyCheck(getSizeProperty) {
  return function (collection) {
    var sizeProperty = getSizeProperty(collection);
    return typeof sizeProperty == "number" && sizeProperty >= 0 && sizeProperty <= MAX_ARRAY_INDEX;
  };
}
function shallowProperty(key) {
  return function (obj) {
    return obj == null ? void 0 : obj[key];
  };
}
var getByteLength = shallowProperty("byteLength");
var isBufferLike = createSizePropertyCheck(getByteLength);
var typedArrayPattern = /\[object ((I|Ui)nt(8|16|32)|Float(32|64)|Uint8Clamped|Big(I|Ui)nt64)Array\]/;
function isTypedArray(obj) {
  return nativeIsView ? nativeIsView(obj) && !isDataView$1(obj) : isBufferLike(obj) && typedArrayPattern.test(toString.call(obj));
}
var isTypedArray$1 = supportsArrayBuffer ? isTypedArray : constant(false);
var getLength = shallowProperty("length");
function emulatedSet(keys2) {
  var hash = {};
  for (var l = keys2.length, i = 0; i < l; ++i) hash[keys2[i]] = true;
  return {
    contains: function (key) {
      return hash[key] === true;
    },
    push: function (key) {
      hash[key] = true;
      return keys2.push(key);
    }
  };
}
function collectNonEnumProps(obj, keys2) {
  keys2 = emulatedSet(keys2);
  var nonEnumIdx = nonEnumerableProps.length;
  var constructor = obj.constructor;
  var proto = isFunction$1(constructor) && constructor.prototype || ObjProto;
  var prop = "constructor";
  if (has$1(obj, prop) && !keys2.contains(prop)) keys2.push(prop);
  while (nonEnumIdx--) {
    prop = nonEnumerableProps[nonEnumIdx];
    if (prop in obj && obj[prop] !== proto[prop] && !keys2.contains(prop)) {
      keys2.push(prop);
    }
  }
}
function keys(obj) {
  if (!isObject(obj)) return [];
  if (nativeKeys) return nativeKeys(obj);
  var keys2 = [];
  for (var key in obj) if (has$1(obj, key)) keys2.push(key);
  if (hasEnumBug) collectNonEnumProps(obj, keys2);
  return keys2;
}
function isEmpty(obj) {
  if (obj == null) return true;
  var length = getLength(obj);
  if (typeof length == "number" && (isArray(obj) || isString(obj) || isArguments$1(obj))) return length === 0;
  return getLength(keys(obj)) === 0;
}
function isMatch(object2, attrs) {
  var _keys = keys(attrs), length = _keys.length;
  if (object2 == null) return !length;
  var obj = Object(object2);
  for (var i = 0; i < length; i++) {
    var key = _keys[i];
    if (attrs[key] !== obj[key] || !(key in obj)) return false;
  }
  return true;
}
function _$1(obj) {
  if (obj instanceof _$1) return obj;
  if (!(this instanceof _$1)) return new _$1(obj);
  this._wrapped = obj;
}
_$1.VERSION = VERSION;
_$1.prototype.value = function () {
  return this._wrapped;
};
_$1.prototype.valueOf = _$1.prototype.toJSON = _$1.prototype.value;
_$1.prototype.toString = function () {
  return String(this._wrapped);
};
function toBufferView(bufferSource) {
  return new Uint8Array(
    bufferSource.buffer || bufferSource,
    bufferSource.byteOffset || 0,
    getByteLength(bufferSource)
  );
}
var tagDataView = "[object DataView]";
function eq(a, b, aStack, bStack) {
  if (a === b) return a !== 0 || 1 / a === 1 / b;
  if (a == null || b == null) return false;
  if (a !== a) return b !== b;
  var type = typeof a;
  if (type !== "function" && type !== "object" && typeof b != "object") return false;
  return deepEq(a, b, aStack, bStack);
}
function deepEq(a, b, aStack, bStack) {
  if (a instanceof _$1) a = a._wrapped;
  if (b instanceof _$1) b = b._wrapped;
  var className = toString.call(a);
  if (className !== toString.call(b)) return false;
  if (hasStringTagBug && className == "[object Object]" && isDataView$1(a)) {
    if (!isDataView$1(b)) return false;
    className = tagDataView;
  }
  switch (className) {
    case "[object RegExp]":
    case "[object String]":
      return "" + a === "" + b;
    case "[object Number]":
      if (+a !== +a) return +b !== +b;
      return +a === 0 ? 1 / +a === 1 / b : +a === +b;
    case "[object Date]":
    case "[object Boolean]":
      return +a === +b;
    case "[object Symbol]":
      return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
    case "[object ArrayBuffer]":
    case tagDataView:
      return deepEq(toBufferView(a), toBufferView(b), aStack, bStack);
  }
  var areArrays = className === "[object Array]";
  if (!areArrays && isTypedArray$1(a)) {
    var byteLength = getByteLength(a);
    if (byteLength !== getByteLength(b)) return false;
    if (a.buffer === b.buffer && a.byteOffset === b.byteOffset) return true;
    areArrays = true;
  }
  if (!areArrays) {
    if (typeof a != "object" || typeof b != "object") return false;
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(isFunction$1(aCtor) && aCtor instanceof aCtor && isFunction$1(bCtor) && bCtor instanceof bCtor) && ("constructor" in a && "constructor" in b)) {
      return false;
    }
  }
  aStack = aStack || [];
  bStack = bStack || [];
  var length = aStack.length;
  while (length--) {
    if (aStack[length] === a) return bStack[length] === b;
  }
  aStack.push(a);
  bStack.push(b);
  if (areArrays) {
    length = a.length;
    if (length !== b.length) return false;
    while (length--) {
      if (!eq(a[length], b[length], aStack, bStack)) return false;
    }
  } else {
    var _keys = keys(a), key;
    length = _keys.length;
    if (keys(b).length !== length) return false;
    while (length--) {
      key = _keys[length];
      if (!(has$1(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
    }
  }
  aStack.pop();
  bStack.pop();
  return true;
}
function isEqual(a, b) {
  return eq(a, b);
}
function allKeys(obj) {
  if (!isObject(obj)) return [];
  var keys2 = [];
  for (var key in obj) keys2.push(key);
  if (hasEnumBug) collectNonEnumProps(obj, keys2);
  return keys2;
}
function ie11fingerprint(methods) {
  var length = getLength(methods);
  return function (obj) {
    if (obj == null) return false;
    var keys2 = allKeys(obj);
    if (getLength(keys2)) return false;
    for (var i = 0; i < length; i++) {
      if (!isFunction$1(obj[methods[i]])) return false;
    }
    return methods !== weakMapMethods || !isFunction$1(obj[forEachName]);
  };
}
var forEachName = "forEach", hasName = "has", commonInit = ["clear", "delete"], mapTail = ["get", hasName, "set"];
var mapMethods = commonInit.concat(forEachName, mapTail), weakMapMethods = commonInit.concat(mapTail), setMethods = ["add"].concat(commonInit, forEachName, hasName);
var isMap = isIE11 ? ie11fingerprint(mapMethods) : tagTester("Map");
var isWeakMap = isIE11 ? ie11fingerprint(weakMapMethods) : tagTester("WeakMap");
var isSet = isIE11 ? ie11fingerprint(setMethods) : tagTester("Set");
var isWeakSet = tagTester("WeakSet");
function values(obj) {
  var _keys = keys(obj);
  var length = _keys.length;
  var values2 = Array(length);
  for (var i = 0; i < length; i++) {
    values2[i] = obj[_keys[i]];
  }
  return values2;
}
function pairs(obj) {
  var _keys = keys(obj);
  var length = _keys.length;
  var pairs2 = Array(length);
  for (var i = 0; i < length; i++) {
    pairs2[i] = [_keys[i], obj[_keys[i]]];
  }
  return pairs2;
}
function invert(obj) {
  var result2 = {};
  var _keys = keys(obj);
  for (var i = 0, length = _keys.length; i < length; i++) {
    result2[obj[_keys[i]]] = _keys[i];
  }
  return result2;
}
function functions(obj) {
  var names = [];
  for (var key in obj) {
    if (isFunction$1(obj[key])) names.push(key);
  }
  return names.sort();
}
function createAssigner(keysFunc, defaults2) {
  return function (obj) {
    var length = arguments.length;
    if (defaults2) obj = Object(obj);
    if (length < 2 || obj == null) return obj;
    for (var index = 1; index < length; index++) {
      var source = arguments[index], keys2 = keysFunc(source), l = keys2.length;
      for (var i = 0; i < l; i++) {
        var key = keys2[i];
        if (!defaults2 || obj[key] === void 0) obj[key] = source[key];
      }
    }
    return obj;
  };
}
var extend = createAssigner(allKeys);
var extendOwn = createAssigner(keys);
var defaults = createAssigner(allKeys, true);
function ctor() {
  return function () {
  };
}
function baseCreate(prototype) {
  if (!isObject(prototype)) return {};
  if (nativeCreate) return nativeCreate(prototype);
  var Ctor = ctor();
  Ctor.prototype = prototype;
  var result2 = new Ctor();
  Ctor.prototype = null;
  return result2;
}
function create(prototype, props) {
  var result2 = baseCreate(prototype);
  if (props) extendOwn(result2, props);
  return result2;
}
function clone(obj) {
  if (!isObject(obj)) return obj;
  return isArray(obj) ? obj.slice() : extend({}, obj);
}
function tap(obj, interceptor) {
  interceptor(obj);
  return obj;
}
function toPath$1(path) {
  return isArray(path) ? path : [path];
}
_$1.toPath = toPath$1;
function toPath(path) {
  return _$1.toPath(path);
}
function deepGet(obj, path) {
  var length = path.length;
  for (var i = 0; i < length; i++) {
    if (obj == null) return void 0;
    obj = obj[path[i]];
  }
  return length ? obj : void 0;
}
function get(object2, path, defaultValue) {
  var value = deepGet(object2, toPath(path));
  return isUndefined(value) ? defaultValue : value;
}
function has(obj, path) {
  path = toPath(path);
  var length = path.length;
  for (var i = 0; i < length; i++) {
    var key = path[i];
    if (!has$1(obj, key)) return false;
    obj = obj[key];
  }
  return !!length;
}
function identity(value) {
  return value;
}
function matcher(attrs) {
  attrs = extendOwn({}, attrs);
  return function (obj) {
    return isMatch(obj, attrs);
  };
}
function property(path) {
  path = toPath(path);
  return function (obj) {
    return deepGet(obj, path);
  };
}
function optimizeCb(func, context, argCount) {
  if (context === void 0) return func;
  switch (argCount == null ? 3 : argCount) {
    case 1:
      return function (value) {
        return func.call(context, value);
      };
    case 3:
      return function (value, index, collection) {
        return func.call(context, value, index, collection);
      };
    case 4:
      return function (accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
  }
  return function () {
    return func.apply(context, arguments);
  };
}
function baseIteratee(value, context, argCount) {
  if (value == null) return identity;
  if (isFunction$1(value)) return optimizeCb(value, context, argCount);
  if (isObject(value) && !isArray(value)) return matcher(value);
  return property(value);
}
function iteratee(value, context) {
  return baseIteratee(value, context, Infinity);
}
_$1.iteratee = iteratee;
function cb(value, context, argCount) {
  if (_$1.iteratee !== iteratee) return _$1.iteratee(value, context);
  return baseIteratee(value, context, argCount);
}
function mapObject(obj, iteratee2, context) {
  iteratee2 = cb(iteratee2, context);
  var _keys = keys(obj), length = _keys.length, results = {};
  for (var index = 0; index < length; index++) {
    var currentKey = _keys[index];
    results[currentKey] = iteratee2(obj[currentKey], currentKey, obj);
  }
  return results;
}
function noop() {
}
function propertyOf(obj) {
  if (obj == null) return noop;
  return function (path) {
    return get(obj, path);
  };
}
function times(n, iteratee2, context) {
  var accum = Array(Math.max(0, n));
  iteratee2 = optimizeCb(iteratee2, context, 1);
  for (var i = 0; i < n; i++) accum[i] = iteratee2(i);
  return accum;
}
function random(min2, max2) {
  if (max2 == null) {
    max2 = min2;
    min2 = 0;
  }
  return min2 + Math.floor(Math.random() * (max2 - min2 + 1));
}
var now = Date.now || function () {
  return (/* @__PURE__ */ new Date()).getTime();
};
function createEscaper(map2) {
  var escaper = function (match) {
    return map2[match];
  };
  var source = "(?:" + keys(map2).join("|") + ")";
  var testRegexp = RegExp(source);
  var replaceRegexp = RegExp(source, "g");
  return function (string) {
    string = string == null ? "" : "" + string;
    return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
  };
}
var escapeMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "`": "&#x60;"
};
var _escape = createEscaper(escapeMap);
var unescapeMap = invert(escapeMap);
var _unescape = createEscaper(unescapeMap);
var templateSettings = _$1.templateSettings = {
  evaluate: /<%([\s\S]+?)%>/g,
  interpolate: /<%=([\s\S]+?)%>/g,
  escape: /<%-([\s\S]+?)%>/g
};
var noMatch = /(.)^/;
var escapes = {
  "'": "'",
  "\\": "\\",
  "\r": "r",
  "\n": "n",
  "\u2028": "u2028",
  "\u2029": "u2029"
};
var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;
function escapeChar(match) {
  return "\\" + escapes[match];
}
var bareIdentifier = /^\s*(\w|\$)+\s*$/;
function template(text, settings, oldSettings) {
  if (!settings && oldSettings) settings = oldSettings;
  settings = defaults({}, settings, _$1.templateSettings);
  var matcher2 = RegExp([
    (settings.escape || noMatch).source,
    (settings.interpolate || noMatch).source,
    (settings.evaluate || noMatch).source
  ].join("|") + "|$", "g");
  var index = 0;
  var source = "__p+='";
  text.replace(matcher2, function (match, escape, interpolate, evaluate, offset) {
    source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
    index = offset + match.length;
    if (escape) {
      source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
    } else if (interpolate) {
      source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
    } else if (evaluate) {
      source += "';\n" + evaluate + "\n__p+='";
    }
    return match;
  });
  source += "';\n";
  var argument = settings.variable;
  if (argument) {
    if (!bareIdentifier.test(argument)) throw new Error(
      "variable is not a bare identifier: " + argument
    );
  } else {
    source = "with(obj||{}){\n" + source + "}\n";
    argument = "obj";
  }
  source = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + source + "return __p;\n";
  var render;
  try {
    render = new Function(argument, "_", source);
  } catch (e) {
    e.source = source;
    throw e;
  }
  var template2 = function (data) {
    return render.call(this, data, _$1);
  };
  template2.source = "function(" + argument + "){\n" + source + "}";
  return template2;
}
function result(obj, path, fallback) {
  path = toPath(path);
  var length = path.length;
  if (!length) {
    return isFunction$1(fallback) ? fallback.call(obj) : fallback;
  }
  for (var i = 0; i < length; i++) {
    var prop = obj == null ? void 0 : obj[path[i]];
    if (prop === void 0) {
      prop = fallback;
      i = length;
    }
    obj = isFunction$1(prop) ? prop.call(obj) : prop;
  }
  return obj;
}
var idCounter = 0;
function uniqueId(prefix) {
  var id2 = ++idCounter + "";
  return prefix ? prefix + id2 : id2;
}
function chain(obj) {
  var instance = _$1(obj);
  instance._chain = true;
  return instance;
}
function executeBound(sourceFunc, boundFunc, context, callingContext, args) {
  if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
  var self2 = baseCreate(sourceFunc.prototype);
  var result2 = sourceFunc.apply(self2, args);
  if (isObject(result2)) return result2;
  return self2;
}
var partial = restArguments(function (func, boundArgs) {
  var placeholder = partial.placeholder;
  var bound = function () {
    var position = 0, length = boundArgs.length;
    var args = Array(length);
    for (var i = 0; i < length; i++) {
      args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
    }
    while (position < arguments.length) args.push(arguments[position++]);
    return executeBound(func, bound, this, this, args);
  };
  return bound;
});
partial.placeholder = _$1;
var bind = restArguments(function (func, context, args) {
  if (!isFunction$1(func)) throw new TypeError("Bind must be called on a function");
  var bound = restArguments(function (callArgs) {
    return executeBound(func, bound, context, this, args.concat(callArgs));
  });
  return bound;
});
var isArrayLike = createSizePropertyCheck(getLength);
function flatten$1(input, depth, strict, output) {
  output = output || [];
  if (!depth && depth !== 0) {
    depth = Infinity;
  } else if (depth <= 0) {
    return output.concat(input);
  }
  var idx = output.length;
  for (var i = 0, length = getLength(input); i < length; i++) {
    var value = input[i];
    if (isArrayLike(value) && (isArray(value) || isArguments$1(value))) {
      if (depth > 1) {
        flatten$1(value, depth - 1, strict, output);
        idx = output.length;
      } else {
        var j = 0, len = value.length;
        while (j < len) output[idx++] = value[j++];
      }
    } else if (!strict) {
      output[idx++] = value;
    }
  }
  return output;
}
var bindAll = restArguments(function (obj, keys2) {
  keys2 = flatten$1(keys2, false, false);
  var index = keys2.length;
  if (index < 1) throw new Error("bindAll must be passed function names");
  while (index--) {
    var key = keys2[index];
    obj[key] = bind(obj[key], obj);
  }
  return obj;
});
function memoize(func, hasher) {
  var memoize2 = function (key) {
    var cache = memoize2.cache;
    var address = "" + (hasher ? hasher.apply(this, arguments) : key);
    if (!has$1(cache, address)) cache[address] = func.apply(this, arguments);
    return cache[address];
  };
  memoize2.cache = {};
  return memoize2;
}
var delay = restArguments(function (func, wait, args) {
  return setTimeout(function () {
    return func.apply(null, args);
  }, wait);
});
var defer = partial(delay, _$1, 1);
function throttle(func, wait, options) {
  var timeout, context, args, result2;
  var previous = 0;
  if (!options) options = {};
  var later = function () {
    previous = options.leading === false ? 0 : now();
    timeout = null;
    result2 = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  var throttled = function () {
    var _now = now();
    if (!previous && options.leading === false) previous = _now;
    var remaining = wait - (_now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = _now;
      result2 = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result2;
  };
  throttled.cancel = function () {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };
  return throttled;
}
function debounce(func, wait, immediate) {
  var timeout, previous, args, result2, context;
  var later = function () {
    var passed = now() - previous;
    if (wait > passed) {
      timeout = setTimeout(later, wait - passed);
    } else {
      timeout = null;
      if (!immediate) result2 = func.apply(context, args);
      if (!timeout) args = context = null;
    }
  };
  var debounced = restArguments(function (_args) {
    context = this;
    args = _args;
    previous = now();
    if (!timeout) {
      timeout = setTimeout(later, wait);
      if (immediate) result2 = func.apply(context, args);
    }
    return result2;
  });
  debounced.cancel = function () {
    clearTimeout(timeout);
    timeout = args = context = null;
  };
  return debounced;
}
function wrap(func, wrapper) {
  return partial(wrapper, func);
}
function negate(predicate) {
  return function () {
    return !predicate.apply(this, arguments);
  };
}
function compose() {
  var args = arguments;
  var start = args.length - 1;
  return function () {
    var i = start;
    var result2 = args[start].apply(this, arguments);
    while (i--) result2 = args[i].call(this, result2);
    return result2;
  };
}
function after(times2, func) {
  return function () {
    if (--times2 < 1) {
      return func.apply(this, arguments);
    }
  };
}
function before(times2, func) {
  var memo;
  return function () {
    if (--times2 > 0) {
      memo = func.apply(this, arguments);
    }
    if (times2 <= 1) func = null;
    return memo;
  };
}
var once = partial(before, 2);
function findKey(obj, predicate, context) {
  predicate = cb(predicate, context);
  var _keys = keys(obj), key;
  for (var i = 0, length = _keys.length; i < length; i++) {
    key = _keys[i];
    if (predicate(obj[key], key, obj)) return key;
  }
}
function createPredicateIndexFinder(dir) {
  return function (array, predicate, context) {
    predicate = cb(predicate, context);
    var length = getLength(array);
    var index = dir > 0 ? 0 : length - 1;
    for (; index >= 0 && index < length; index += dir) {
      if (predicate(array[index], index, array)) return index;
    }
    return -1;
  };
}
var findIndex = createPredicateIndexFinder(1);
var findLastIndex = createPredicateIndexFinder(-1);
function sortedIndex(array, obj, iteratee2, context) {
  iteratee2 = cb(iteratee2, context, 1);
  var value = iteratee2(obj);
  var low = 0, high = getLength(array);
  while (low < high) {
    var mid = Math.floor((low + high) / 2);
    if (iteratee2(array[mid]) < value) low = mid + 1;
    else high = mid;
  }
  return low;
}
function createIndexFinder(dir, predicateFind, sortedIndex2) {
  return function (array, item, idx) {
    var i = 0, length = getLength(array);
    if (typeof idx == "number") {
      if (dir > 0) {
        i = idx >= 0 ? idx : Math.max(idx + length, i);
      } else {
        length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
      }
    } else if (sortedIndex2 && idx && length) {
      idx = sortedIndex2(array, item);
      return array[idx] === item ? idx : -1;
    }
    if (item !== item) {
      idx = predicateFind(slice.call(array, i, length), isNaN$1);
      return idx >= 0 ? idx + i : -1;
    }
    for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
      if (array[idx] === item) return idx;
    }
    return -1;
  };
}
var indexOf = createIndexFinder(1, findIndex, sortedIndex);
var lastIndexOf = createIndexFinder(-1, findLastIndex);
function find(obj, predicate, context) {
  var keyFinder = isArrayLike(obj) ? findIndex : findKey;
  var key = keyFinder(obj, predicate, context);
  if (key !== void 0 && key !== -1) return obj[key];
}
function findWhere(obj, attrs) {
  return find(obj, matcher(attrs));
}
function each(obj, iteratee2, context) {
  iteratee2 = optimizeCb(iteratee2, context);
  var i, length;
  if (isArrayLike(obj)) {
    for (i = 0, length = obj.length; i < length; i++) {
      iteratee2(obj[i], i, obj);
    }
  } else {
    var _keys = keys(obj);
    for (i = 0, length = _keys.length; i < length; i++) {
      iteratee2(obj[_keys[i]], _keys[i], obj);
    }
  }
  return obj;
}
function map(obj, iteratee2, context) {
  iteratee2 = cb(iteratee2, context);
  var _keys = !isArrayLike(obj) && keys(obj), length = (_keys || obj).length, results = Array(length);
  for (var index = 0; index < length; index++) {
    var currentKey = _keys ? _keys[index] : index;
    results[index] = iteratee2(obj[currentKey], currentKey, obj);
  }
  return results;
}
function createReduce(dir) {
  var reducer = function (obj, iteratee2, memo, initial2) {
    var _keys = !isArrayLike(obj) && keys(obj), length = (_keys || obj).length, index = dir > 0 ? 0 : length - 1;
    if (!initial2) {
      memo = obj[_keys ? _keys[index] : index];
      index += dir;
    }
    for (; index >= 0 && index < length; index += dir) {
      var currentKey = _keys ? _keys[index] : index;
      memo = iteratee2(memo, obj[currentKey], currentKey, obj);
    }
    return memo;
  };
  return function (obj, iteratee2, memo, context) {
    var initial2 = arguments.length >= 3;
    return reducer(obj, optimizeCb(iteratee2, context, 4), memo, initial2);
  };
}
var reduce = createReduce(1);
var reduceRight = createReduce(-1);
function filter(obj, predicate, context) {
  var results = [];
  predicate = cb(predicate, context);
  each(obj, function (value, index, list) {
    if (predicate(value, index, list)) results.push(value);
  });
  return results;
}
function reject(obj, predicate, context) {
  return filter(obj, negate(cb(predicate)), context);
}
function every(obj, predicate, context) {
  predicate = cb(predicate, context);
  var _keys = !isArrayLike(obj) && keys(obj), length = (_keys || obj).length;
  for (var index = 0; index < length; index++) {
    var currentKey = _keys ? _keys[index] : index;
    if (!predicate(obj[currentKey], currentKey, obj)) return false;
  }
  return true;
}
function some(obj, predicate, context) {
  predicate = cb(predicate, context);
  var _keys = !isArrayLike(obj) && keys(obj), length = (_keys || obj).length;
  for (var index = 0; index < length; index++) {
    var currentKey = _keys ? _keys[index] : index;
    if (predicate(obj[currentKey], currentKey, obj)) return true;
  }
  return false;
}
function contains(obj, item, fromIndex, guard) {
  if (!isArrayLike(obj)) obj = values(obj);
  if (typeof fromIndex != "number" || guard) fromIndex = 0;
  return indexOf(obj, item, fromIndex) >= 0;
}
var invoke = restArguments(function (obj, path, args) {
  var contextPath, func;
  if (isFunction$1(path)) {
    func = path;
  } else {
    path = toPath(path);
    contextPath = path.slice(0, -1);
    path = path[path.length - 1];
  }
  return map(obj, function (context) {
    var method = func;
    if (!method) {
      if (contextPath && contextPath.length) {
        context = deepGet(context, contextPath);
      }
      if (context == null) return void 0;
      method = context[path];
    }
    return method == null ? method : method.apply(context, args);
  });
});
function pluck(obj, key) {
  return map(obj, property(key));
}
function where(obj, attrs) {
  return filter(obj, matcher(attrs));
}
function max(obj, iteratee2, context) {
  var result2 = -Infinity, lastComputed = -Infinity, value, computed;
  if (iteratee2 == null || typeof iteratee2 == "number" && typeof obj[0] != "object" && obj != null) {
    obj = isArrayLike(obj) ? obj : values(obj);
    for (var i = 0, length = obj.length; i < length; i++) {
      value = obj[i];
      if (value != null && value > result2) {
        result2 = value;
      }
    }
  } else {
    iteratee2 = cb(iteratee2, context);
    each(obj, function (v, index, list) {
      computed = iteratee2(v, index, list);
      if (computed > lastComputed || computed === -Infinity && result2 === -Infinity) {
        result2 = v;
        lastComputed = computed;
      }
    });
  }
  return result2;
}
function min(obj, iteratee2, context) {
  var result2 = Infinity, lastComputed = Infinity, value, computed;
  if (iteratee2 == null || typeof iteratee2 == "number" && typeof obj[0] != "object" && obj != null) {
    obj = isArrayLike(obj) ? obj : values(obj);
    for (var i = 0, length = obj.length; i < length; i++) {
      value = obj[i];
      if (value != null && value < result2) {
        result2 = value;
      }
    }
  } else {
    iteratee2 = cb(iteratee2, context);
    each(obj, function (v, index, list) {
      computed = iteratee2(v, index, list);
      if (computed < lastComputed || computed === Infinity && result2 === Infinity) {
        result2 = v;
        lastComputed = computed;
      }
    });
  }
  return result2;
}
var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
function toArray(obj) {
  if (!obj) return [];
  if (isArray(obj)) return slice.call(obj);
  if (isString(obj)) {
    return obj.match(reStrSymbol);
  }
  if (isArrayLike(obj)) return map(obj, identity);
  return values(obj);
}
function sample(obj, n, guard) {
  if (n == null || guard) {
    if (!isArrayLike(obj)) obj = values(obj);
    return obj[random(obj.length - 1)];
  }
  var sample2 = toArray(obj);
  var length = getLength(sample2);
  n = Math.max(Math.min(n, length), 0);
  var last2 = length - 1;
  for (var index = 0; index < n; index++) {
    var rand = random(index, last2);
    var temp = sample2[index];
    sample2[index] = sample2[rand];
    sample2[rand] = temp;
  }
  return sample2.slice(0, n);
}
function shuffle(obj) {
  return sample(obj, Infinity);
}
function sortBy(obj, iteratee2, context) {
  var index = 0;
  iteratee2 = cb(iteratee2, context);
  return pluck(map(obj, function (value, key, list) {
    return {
      value,
      index: index++,
      criteria: iteratee2(value, key, list)
    };
  }).sort(function (left, right) {
    var a = left.criteria;
    var b = right.criteria;
    if (a !== b) {
      if (a > b || a === void 0) return 1;
      if (a < b || b === void 0) return -1;
    }
    return left.index - right.index;
  }), "value");
}
function group(behavior, partition2) {
  return function (obj, iteratee2, context) {
    var result2 = partition2 ? [[], []] : {};
    iteratee2 = cb(iteratee2, context);
    each(obj, function (value, index) {
      var key = iteratee2(value, index, obj);
      behavior(result2, value, key);
    });
    return result2;
  };
}
var groupBy = group(function (result2, value, key) {
  if (has$1(result2, key)) result2[key].push(value);
  else result2[key] = [value];
});
var indexBy = group(function (result2, value, key) {
  result2[key] = value;
});
var countBy = group(function (result2, value, key) {
  if (has$1(result2, key)) result2[key]++;
  else result2[key] = 1;
});
var partition = group(function (result2, value, pass) {
  result2[pass ? 0 : 1].push(value);
}, true);
function size(obj) {
  if (obj == null) return 0;
  return isArrayLike(obj) ? obj.length : keys(obj).length;
}
function keyInObj(value, key, obj) {
  return key in obj;
}
var pick = restArguments(function (obj, keys2) {
  var result2 = {}, iteratee2 = keys2[0];
  if (obj == null) return result2;
  if (isFunction$1(iteratee2)) {
    if (keys2.length > 1) iteratee2 = optimizeCb(iteratee2, keys2[1]);
    keys2 = allKeys(obj);
  } else {
    iteratee2 = keyInObj;
    keys2 = flatten$1(keys2, false, false);
    obj = Object(obj);
  }
  for (var i = 0, length = keys2.length; i < length; i++) {
    var key = keys2[i];
    var value = obj[key];
    if (iteratee2(value, key, obj)) result2[key] = value;
  }
  return result2;
});
var omit = restArguments(function (obj, keys2) {
  var iteratee2 = keys2[0], context;
  if (isFunction$1(iteratee2)) {
    iteratee2 = negate(iteratee2);
    if (keys2.length > 1) context = keys2[1];
  } else {
    keys2 = map(flatten$1(keys2, false, false), String);
    iteratee2 = function (value, key) {
      return !contains(keys2, key);
    };
  }
  return pick(obj, iteratee2, context);
});
function initial(array, n, guard) {
  return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
}
function first(array, n, guard) {
  if (array == null || array.length < 1) return n == null || guard ? void 0 : [];
  if (n == null || guard) return array[0];
  return initial(array, array.length - n);
}
function rest(array, n, guard) {
  return slice.call(array, n == null || guard ? 1 : n);
}
function last(array, n, guard) {
  if (array == null || array.length < 1) return n == null || guard ? void 0 : [];
  if (n == null || guard) return array[array.length - 1];
  return rest(array, Math.max(0, array.length - n));
}
function compact(array) {
  return filter(array, Boolean);
}
function flatten(array, depth) {
  return flatten$1(array, depth, false);
}
var difference = restArguments(function (array, rest2) {
  rest2 = flatten$1(rest2, true, true);
  return filter(array, function (value) {
    return !contains(rest2, value);
  });
});
var without = restArguments(function (array, otherArrays) {
  return difference(array, otherArrays);
});
function uniq(array, isSorted, iteratee2, context) {
  if (!isBoolean(isSorted)) {
    context = iteratee2;
    iteratee2 = isSorted;
    isSorted = false;
  }
  if (iteratee2 != null) iteratee2 = cb(iteratee2, context);
  var result2 = [];
  var seen = [];
  for (var i = 0, length = getLength(array); i < length; i++) {
    var value = array[i], computed = iteratee2 ? iteratee2(value, i, array) : value;
    if (isSorted && !iteratee2) {
      if (!i || seen !== computed) result2.push(value);
      seen = computed;
    } else if (iteratee2) {
      if (!contains(seen, computed)) {
        seen.push(computed);
        result2.push(value);
      }
    } else if (!contains(result2, value)) {
      result2.push(value);
    }
  }
  return result2;
}
var union = restArguments(function (arrays) {
  return uniq(flatten$1(arrays, true, true));
});
function intersection(array) {
  var result2 = [];
  var argsLength = arguments.length;
  for (var i = 0, length = getLength(array); i < length; i++) {
    var item = array[i];
    if (contains(result2, item)) continue;
    var j;
    for (j = 1; j < argsLength; j++) {
      if (!contains(arguments[j], item)) break;
    }
    if (j === argsLength) result2.push(item);
  }
  return result2;
}
function unzip(array) {
  var length = array && max(array, getLength).length || 0;
  var result2 = Array(length);
  for (var index = 0; index < length; index++) {
    result2[index] = pluck(array, index);
  }
  return result2;
}
var zip = restArguments(unzip);
function object(list, values2) {
  var result2 = {};
  for (var i = 0, length = getLength(list); i < length; i++) {
    if (values2) {
      result2[list[i]] = values2[i];
    } else {
      result2[list[i][0]] = list[i][1];
    }
  }
  return result2;
}
function range(start, stop, step) {
  if (stop == null) {
    stop = start || 0;
    start = 0;
  }
  if (!step) {
    step = stop < start ? -1 : 1;
  }
  var length = Math.max(Math.ceil((stop - start) / step), 0);
  var range2 = Array(length);
  for (var idx = 0; idx < length; idx++, start += step) {
    range2[idx] = start;
  }
  return range2;
}
function chunk(array, count) {
  if (count == null || count < 1) return [];
  var result2 = [];
  var i = 0, length = array.length;
  while (i < length) {
    result2.push(slice.call(array, i, i += count));
  }
  return result2;
}
function chainResult(instance, obj) {
  return instance._chain ? _$1(obj).chain() : obj;
}
function mixin(obj) {
  each(functions(obj), function (name) {
    var func = _$1[name] = obj[name];
    _$1.prototype[name] = function () {
      var args = [this._wrapped];
      push.apply(args, arguments);
      return chainResult(this, func.apply(_$1, args));
    };
  });
  return _$1;
}
each(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (name) {
  var method = ArrayProto[name];
  _$1.prototype[name] = function () {
    var obj = this._wrapped;
    if (obj != null) {
      method.apply(obj, arguments);
      if ((name === "shift" || name === "splice") && obj.length === 0) {
        delete obj[0];
      }
    }
    return chainResult(this, obj);
  };
});
each(["concat", "join", "slice"], function (name) {
  var method = ArrayProto[name];
  _$1.prototype[name] = function () {
    var obj = this._wrapped;
    if (obj != null) obj = method.apply(obj, arguments);
    return chainResult(this, obj);
  };
});
var allExports = {
  __proto__: null,
  VERSION,
  restArguments,
  isObject,
  isNull,
  isUndefined,
  isBoolean,
  isElement,
  isString,
  isNumber,
  isDate,
  isRegExp,
  isError,
  isSymbol,
  isArrayBuffer,
  isDataView: isDataView$1,
  isArray,
  isFunction: isFunction$1,
  isArguments: isArguments$1,
  isFinite: isFinite$1,
  isNaN: isNaN$1,
  isTypedArray: isTypedArray$1,
  isEmpty,
  isMatch,
  isEqual,
  isMap,
  isWeakMap,
  isSet,
  isWeakSet,
  keys,
  allKeys,
  values,
  pairs,
  invert,
  functions,
  methods: functions,
  extend,
  extendOwn,
  assign: extendOwn,
  defaults,
  create,
  clone,
  tap,
  get,
  has,
  mapObject,
  identity,
  constant,
  noop,
  toPath: toPath$1,
  property,
  propertyOf,
  matcher,
  matches: matcher,
  times,
  random,
  now,
  escape: _escape,
  unescape: _unescape,
  templateSettings,
  template,
  result,
  uniqueId,
  chain,
  iteratee,
  partial,
  bind,
  bindAll,
  memoize,
  delay,
  defer,
  throttle,
  debounce,
  wrap,
  negate,
  compose,
  after,
  before,
  once,
  findKey,
  findIndex,
  findLastIndex,
  sortedIndex,
  indexOf,
  lastIndexOf,
  find,
  detect: find,
  findWhere,
  each,
  forEach: each,
  map,
  collect: map,
  reduce,
  foldl: reduce,
  inject: reduce,
  reduceRight,
  foldr: reduceRight,
  filter,
  select: filter,
  reject,
  every,
  all: every,
  some,
  any: some,
  contains,
  includes: contains,
  include: contains,
  invoke,
  pluck,
  where,
  max,
  min,
  shuffle,
  sample,
  sortBy,
  groupBy,
  indexBy,
  countBy,
  partition,
  toArray,
  size,
  pick,
  omit,
  first,
  head: first,
  take: first,
  initial,
  last,
  rest,
  tail: rest,
  drop: rest,
  compact,
  flatten,
  without,
  uniq,
  unique: uniq,
  union,
  intersection,
  difference,
  unzip,
  transpose: unzip,
  zip,
  object,
  range,
  chunk,
  mixin,
  "default": _$1
};
var _ = mixin(allExports);
_._ = _;
var underscore_default = _;

// scripts/pdb/storage/NonPersistentStorage.js
var nonPersistentData = {};
var NonPersistentStorage = class {
  load(table) {
    return nonPersistentData[table] ? nonPersistentData[table] : null;
  }
  save(table, data) {
    nonPersistentData[table] = data;
  }
};

// scripts/pdb/storage/ScoreboardPersistentStorage.js
import { world } from "@minecraft/server";
var ScoreboardPersistentStorage = class {
  constructor() {
    this.name = "SCOREBOARD_PERSISTENT";
    this.trashable = true;
  }
  load(table) {
    let scoreboard = world.scoreboard.getObjective("PDB");
    if (!scoreboard) scoreboard = world.scoreboard.addObjective("PDB", "PrismarineDB");
    let val = null;
    for (const participant of scoreboard.getParticipants()) {
      if (participant.displayName.startsWith(`@prismarine[${table}](`)) {
        val = JSON.parse(participant.displayName.substring(`@prismarine[${table}](`.length).slice(0, -1));
      }
    }
    if (!val) return [];
  }
  save(table, data) {
    let scoreboard = world.scoreboard.getObjective("PDB");
    if (!scoreboard) scoreboard = world.scoreboard.addObjective("PDB", "PrismarineDB");
    for (const participant of scoreboard.getParticipants()) {
      if (participant.displayName.startsWith(`@prismarine[${table}](`)) {
        scoreboard.removeParticipant(participant);
      }
    }
    scoreboard.setScore(`@prismarine[${table}](${JSON.stringify(data)})`);
  }
};

// scripts/pdb/storage/WorldPersistentStorage.js
import { world as world2 } from "@minecraft/server";
var WorldPersistentStorage = class {
  constructor() {
    this.name = "WORLD_PERSISTENT";
    this.trashable = true;
  }
  load(table) {
    let val = ``;
    try {
      val = world2.getDynamicProperty(`prismarine:${table}`);
    } catch {
      val = ``;
    }
    if (!val) val = `[]`;
    let data = [];
    try {
      data = JSON.parse(val);
    } catch {
      data = [];
    }
    return data;
  }
  save(table, data) {
    system.run(()=>{
      world2.setDynamicProperty(`prismarine:${table}`, JSON.stringify(data));

    })
  }
};

// scripts/pdb/storage/EntityPersistentStorage.js
var _entity;
var EntityPersistentStorage = class {
  constructor(entity) {
    __privateAdd(this, _entity);
    __privateSet(this, _entity, entity);
  }
  load(table) {
    let val = ``;
    try {
      val = __privateGet(this, _entity).getDynamicProperty(`prismarine:${table}`);
    } catch {
      val = ``;
    }
    if (!val) val = `[]`;
    let data = [];
    try {
      data = JSON.parse(val);
    } catch {
      data = [];
    }
    return data;
  }
  save(table, data) {
    system.run(()=>{
      __privateGet(this, _entity).setDynamicProperty(`prismarine:${table}`, JSON.stringify(data));
    })
  }
};
_entity = new WeakMap();

// scripts/pdb/economy/economy.js
var _table;
import { world as world3 } from "@minecraft/server";
var Economy = class {
  constructor(table) {
    __privateAdd(this, _table);
    __privateSet(this, _table, table);
    __privateGet(this, _table).waitLoad().then(()=>{
      if (!__privateGet(this, _table).findFirst({ type: "CURRENCY", default: true })) {
        __privateGet(this, _table).insertDocument({
          default: true,
          symbol: "$",
          type: "CURRENCY",
          scoreboard: "money",
          displayName: "Coins"
        });
      }
  
    })
  }
  getCurrencies() {
    let array = [];
    for (const doc2 of __privateGet(this, _table).findDocuments({ type: "CURRENCY" })) {
      array.push(doc2.data);
    }
    return array;
  }
  editSymbol(currencyScoreboard, newSymbol2) {
    let doc2 = __privateGet(this, _table).findFirst({ type: "CURRENCY", scoreboard: currencyScoreboard });
    if (doc2) {
      doc2.data.symbol = newSymbol2;
      __privateGet(this, _table).overwriteDataByID(doc2.id, doc2.data);
    }
  }
  editDisplayName(currencyScoreboard, newDisplayName) {
    let doc2 = __privateGet(this, _table).findFirst({ type: "CURRENCY", scoreboard: currencyScoreboard });
    if (doc2) {
      doc2.data.displayName = newDisplayName;
      __privateGet(this, _table).overwriteDataByID(doc2.id, doc2.data);
    }
  }
  editScoreboard(currencyScoreboard, newScoreboard) {
    let doc2 = __privateGet(this, _table).findFirst({ type: "CURRENCY", scoreboard: currencyScoreboard });
    if (doc2) {
      doc2.data.scoreboard = newScoreboard;
      __privateGet(this, _table).overwriteDataByID(doc2.id, doc2.data);
    }
  }
  addCurrency(scoreboard, symbol, displayName) {
    let doc2 = __privateGet(this, _table).findFirst({ type: "CURRENCY", scoreboard });
    if (!doc2) {
      __privateGet(this, _table).insertDocument({
        type: "CURRENCY",
        scoreboard,
        symbol,
        displayName
      });
    }
  }
  deleteCurrency(scoreboard) {
    let doc2 = __privateGet(this, _table).findFirst({ type: "CURRENCY", scoreboard });
    if(doc2) __privateGet(this, _table).deleteDocumentByID(doc2.id);
  }
  getCurrency(scoreboard = "default") {
    if (scoreboard == "default") {
      let doc3 = __privateGet(this, _table).findFirst({ type: "CURRENCY", default: true });
      return doc3 ? doc3.data : null;
    }
    let doc2 = __privateGet(this, _table).findFirst({ type: "CURRENCY", scoreboard }) || __privateGet(this, _table).findFirst({ type: "CURRENCY", default: true });
    return doc2 ? doc2.data : null;
  }
  addMoney(player, amount2, currencyScoreboard = "default") {
    if (typeof amount2 != "number") throw new Error("Amount must be number!");
    if (amount2 < 0) throw new Error("Amount must be positive");
    let currency = this.getCurrency(currencyScoreboard);
    if (currency) {
      let scoreboard = world3.scoreboard.getObjective(currency.scoreboard);
      if (!scoreboard) scoreboard = world3.scoreboard.addObjective(currency.scoreboard, currency.scoreboard);
      scoreboard.addScore(player, amount2);
    }
  }
  removeMoney(player, amount2, currencyScoreboard = "default") {
    if (typeof amount2 != "number") throw new Error("Amount must be number!");
    if (amount2 < 0) throw new Error("Amount must be positive");
    let currency = this.getCurrency(currencyScoreboard);
    if (currency) {
      let scoreboard = world3.scoreboard.getObjective(currency.scoreboard);
      if (!scoreboard) scoreboard = world3.scoreboard.addObjective(currency.scoreboard, currency.scoreboard);
      scoreboard.addScore(player, -amount2);
    }
  }
  getMoney(player, currencyScoreboard = "default") {
    let currency = this.getCurrency(currencyScoreboard);
    if (currency) {
      let scoreboard = world3.scoreboard.getObjective(currency.scoreboard);
      if (!scoreboard) scoreboard = world3.scoreboard.addObjective(currency.scoreboard, currency.scoreboard);
      let score = 0;
      try {
        score = scoreboard.getScore(player);
      } catch {
        score = 0;
      }
      if (!score) score = 0;
      return score;
    }
    return 0;
  }
};
_table = new WeakMap();

// scripts/pdb/forms/ActionForm.js
var _form;
import { ActionFormData } from "@minecraft/server-ui";
var ActionForm = class {
  constructor() {
    __privateAdd(this, _form);
    this.callbacks = [];
    __privateSet(this, _form, new ActionFormData());
  }
  button(text, icon, callback) {
    if (callback) this.callbacks.push(callback);
    else this.callbacks.push(null);
    __privateGet(this, _form).button(text, icon ? icon : void 0);
  }
  title(text) {
    __privateGet(this, _form).title(text);
  }
  body(text) {
    __privateGet(this, _form).body(text);
  }
  show(player, responseFn) {
    __privateGet(this, _form).show(player).then((res) => {
      if (responseFn && typeof responseFn == "function") {
        responseFn(player, res);
      }
      if (res.canceled) return;
      if (this.callbacks[res.selection] && typeof this.callbacks[res.selection] === "function") {
        this.callbacks[res.selection](player, res);
      }
    });
  }
};
_form = new WeakMap();

// scripts/pdb/forms/ModalForm.js
var _current, _form2, _controlMap;
import { ModalFormData } from "@minecraft/server-ui";
var ModalForm = class {
  constructor() {
    __privateAdd(this, _current);
    __privateAdd(this, _form2);
    __privateAdd(this, _controlMap);
    __privateSet(this, _current, -1);
    __privateSet(this, _form2, new ModalFormData());
    __privateSet(this, _controlMap, /* @__PURE__ */ new Map());
  }
  textField(id2, label, placeholder, defaultValue) {
    __privateGet(this, _form2).textField(label, placeholder, defaultValue ? defaultValue : void 0);
    __privateWrapper(this, _current)._++;
    if (id2) {
      __privateGet(this, _controlMap).set(id2, __privateGet(this, _current));
    }
  }
  slider(id2, label, min2, max2, step, defaultValue) {
    __privateGet(this, _form2).slider(label, min2, max2, step, defaultValue ? defaultValue : 1);
    __privateWrapper(this, _current)._++;
    if (id2) {
      __privateGet(this, _controlMap).set(id2, __privateGet(this, _current));
    }
  }
  dropdown(id2, label, options, defaultValue) {
    __privateGet(this, _form2).dropdown(label, options, defaultValue ? defaultValue : 0);
    __privateWrapper(this, _current)._++;
    if (id2) {
      __privateGet(this, _controlMap).set(id2, __privateGet(this, _current));
    }
  }
  toggle(id2, label, defaultValue) {
    __privateGet(this, _form2).toggle(label, defaultValue ? defaultValue : false);
    __privateWrapper(this, _current)._++;
    if (id2) {
      __privateGet(this, _controlMap).set(id2, __privateGet(this, _current));
    }
  }
  show(player, responseFn) {
    __privateGet(this, _form2).show(player).then((res) => {
      if (res.canceled) return;
      if (responseFn) responseFn.call({
        get: (id2) => {
          if (!__privateGet(this, _controlMap).has(id2)) return null;
          return res.formValues[__privateGet(this, _controlMap).get(id2)];
        }
      }, player, res);
    });
  }
};
_current = new WeakMap();
_form2 = new WeakMap();
_controlMap = new WeakMap();

// scripts/pdb/prismarinedb.js
var _storage, _PrismarineDBTable_instances, genID_fn, invokeEvent_fn, keyval_fn, updateEvent_fn, _ExtensionRegistry_instances, initialize_fn, _funcs, _groupName, _stores, _table2, _db, _defaultPermissions, _reservedTable, _reservedKeyVal, _reservedKeyVals, _reservedEconomyTable, _PrismarineDB_instances, getStorage_fn, _variants;
import { world as world4, system } from "@minecraft/server";
function MergeRecursive(obj1, obj2) {
  for (var p in obj2) {
    try {
      if (obj2[p].constructor == Object) {
        obj1[p] = MergeRecursive(obj1[p], obj2[p]);
      } else {
        obj1[p] = obj2[p];
      }
    } catch (e) {
      obj1[p] = obj2[p];
    }
  }
  return obj1;
}
var nonPersistentData2 = {};
var sessions = {};
var generateUUID = () => {
  let d = (/* @__PURE__ */ new Date()).getTime(), d2 = typeof performance !== "undefined" && performance.now && performance.now() * 1e3 || 0;
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    let r = Math.random() * 16;
    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c == "x" ? r : r & 7 | 8).toString(16);
  });
};
export let databaseTables = [];
var PrismarineDBTable = class {
  constructor(tableName = "default", storage) {
    __privateAdd(this, _PrismarineDBTable_instances);
    __privateAdd(this, _storage);
    __privateSet(this, _storage, storage);
    this.table = tableName;
    this.data = [];
    databaseTables.push((msg)=>{
      this.globcmd(msg)
    })
    this.loaded = false;
    this.trash = [];
    this.folders = [];
    
    // Load data immediately but don't wait for it
    this.load().then(() => {
      this.loadTrash();
      this.loadFolders();
    });
    
    this.updateEvents = [];
  }
  trashAll() {
    for (const doc2 of this.data) {
      this.trashDocumentByID(doc2.id);
    }
  }
  globcmd(msg) {
    if(Array.isArray(msg)) {
      // if(msg[0] == "SAVE") {
        // if(this.lastSaveID != msg[1]) {
          // this.loaded = false;
          // this.load();
        // }
      // }
    }
    if(msg == "CLEAR") {
      this.clear();
    }
    if(msg == "RELOAD") {
      this.loaded = false;
      this.load().then(() => {
        this.loadTrash();
        this.loadFolders();
      });  
    }
  }
  runCommand(text) {
    let args = text.split(" ");
    if (args[0].toLowerCase() == "clear") {
      this.clear();
    }
  }
  loadFolders() {
    return new Promise((resolve) => {
      system.run(() => {
        this.folders = __privateGet(this, _storage).load(`${this.table}~folders`);
        resolve(this.folders);
      });
    });
  }
  saveFolders() {
    __privateGet(this, _storage).save(`${this.table}~folders`, this.folders);
  }
  loadTrash() {
    return new Promise((resolve) => {
      system.run(() => {
        this.trash = __privateGet(this, _storage).load(`${this.table}~trash`);
        resolve(this.trash);
      });
    });
  }
  saveTrash(trashedData = null) {
    system.run(()=>{
      __privateGet(this, _storage).save(`${this.table}~trash`, this.trash);
      try {
        if (trashedData && __privateGet(this, _storage).trashable && __privateGet(this, _storage).name && stores[__privateGet(this, _storage).name]) {
          let data = stores["WORLD_PERSISTENT"].load(`+PRISM:$TRASH`);
          data.push({
            store: __privateGet(this, _storage).name,
            table: this.table,
            data: trashedData
          });
          stores["WORLD_PERSISTENT"].save(`+PRISM:$TRASH`, data);
        }
      } catch {
      }
  
    })
  }
  setData(data) {
    // system.run(()=>{
      // world2.sendMessage(JSON.stringify(data))
    // })
    if(!data) {
      this.loaded = true;
      return;
    }
    this.data = data ? data : [];
    this.loaded = true;
  }
  load() {
    return new Promise((resolve) => {
      let storage = __privateGet(this, _storage);
      system.run(() => {
        let data = storage.load(this.table);
        this.setData(data);
        resolve(data);
      });
    });
  }
  save() {
    if(!this.loaded) return;
    this.lastSaveID = Date.now();
    return new Promise((resolve) => {
      system.run(() => {
        __privateGet(this, _storage).save(this.table, this.data);
        __privateMethod(this, _PrismarineDBTable_instances, updateEvent_fn).call(this);
        for(const table of databaseTables) {
          table([`SAVE`, this.table, this.lastSaveID])
        }
        resolve();
      });
    });
  }
  async switchTable(newTable) {
    if(!newTable || typeof newTable !== "string") return false;
    await this.save()
    this.table = newTable;
    this.loaded = false;
    await this.load()
    await this.loadFolders()
    await this.loadTrash()
    return true;
  }
  clear() {
    this.data = [];
    this.save();
  }
  get rawData() {
    return this.data;
  }
  createFolder(name) {
    if (this.folders.find((_2) => _2.name == name)) return;
    this.folders.push({
      name,
      documentIDs: []
    });
    this.saveFolders();
  }
  getFolderDocuments(name) {
    this.loadFolders();
    let folder = this.folders.find((_2) => _2.name == name);
    if (!folder) return;
    let docs = [];
    for (const document of folder.documentIDs) {
      let doc2 = this.getByID(document);
      if (!doc2) {
        folder.documentIDs = folder.documentIDs.filter((_2) => _2 != document);
        this.saveFolders();
      }
      docs.push(doc2);
    }
    return docs;
  }
  addDocumentToFolder(name, id2) {
    this.loadFolders();
    let folder = this.folders.findIndex((_2) => _2.name == name);
    if (folder < 0) return;
    if (this.folders[folder].documentIDs.includes(id2) || !this.getByID(id2)) return;
    this.folders[folder].documentIDs.push(id2);
    this.saveFolders();
  }
  getFolders() {
    return this.folders.map((_2) => _2.name);
  }
  deleteFolder(name) {
    this.folders = this.folders.filter((_2) => _2.name != name);
    this.saveFolders();
  }
  insertDocument(data) {
    let id2 = __privateMethod(this, _PrismarineDBTable_instances, genID_fn).call(this);
    let running = true;
    while(running) {
      if(!this.getByID(id2)) {
        running = false;
        break;
      }
      id2++;
      running = false;
      break;
    }
    this.data.push({
      id: id2,
      data,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    // system.run(()=>{
      this.save();

    // })
    // __privateMethod(this, _PrismarineDBTable_instances, invokeEvent_fn).call(this, "$insert", { id: id2, data, table: this.table, storage: __privateGet(this, _storage) });
    return id2;
  }
  overwriteDataByID(id2, data) {
    let docIndex2 = this.data.findIndex((document) => document.id == id2);
    if (docIndex2 < 0) return null;
    this.data[docIndex2].data = data;
    this.data[docIndex2].updatedAt = Date.now();
    this.save();
    return data;
  }
  matchesQuery(query, data) {
    if (typeof query === "string" && typeof data === "string") return query == data;
    if (typeof query === "object" && typeof data === "string") {
      if (query.lengthGreaterThan) return data.length > query.lengthGreaterThan;
      if (query.lengthLessThan) return data.length > query.lengthLessThan;
      return false;
    }
    if (typeof query === "object" && typeof data === "object") {
      if (data.type && data.type == "Date") {
        if (query.after) return new Date(data.timestamp).getTime() > query.after;
        if (query.before) return new Date(data.timestamp).getTime() < query.before;
        return false;
      } else {
        let matchQueryRecursive = function (query2) {
          for (const key in query2) {
            if (typeof query2[key] !== "object") {
              if (!data[key] || data[key] != query2[key]) unsuccessfulRuns++;
            } else if (typeof query2[key] === "object") {
              matchQueryRecursive(query2[key]);
            }
          }
        };
        let unsuccessfulRuns = 0;
        matchQueryRecursive(query);
        return unsuccessfulRuns == 0;
      }
    }
  }
  findDocuments(query, legacy = false) {
    let docs = [];
    for (const doc2 of this.data) {
      if (query == null) {
        docs.push(doc2);
        continue;
      }
      if (isMatch(doc2.data, query)) docs.push(doc2);
    }
    return docs;
  }
  findFirst(query) {
    let docs = this.findDocuments(query);
    if (docs.length) return docs[0];
    return null;
  }
  updateFirstDocumentByQuery(query, data) {
    let doc2 = this.findFirst(query);
    if (!doc2) return false;
    if (typeof data === "object")
      return this.overwriteDataByID(doc2.id, MergeRecursive(doc2.data, data));
    else
      return this.overwriteDataByID(doc2.id, data);
  }
  overwriteFirstDocumentByQuery(query, data) {
    let doc2 = this.findFirst(query);
    if (!doc2) return false;
    return this.overwriteDataByID(doc2.id, data);
  }
  deleteDocumentByID(id2) {
    let docIndex2 = this.data.findIndex((document) => document.id == id2);
    if (docIndex2 < 0) return false;
    this.data.splice(docIndex2, 1);
    this.save();
    __privateMethod(this, _PrismarineDBTable_instances, invokeEvent_fn).call(this, "$delete", { method: "DELETE_BY_ID", docIndex: docIndex2, id: id2 });
    return true;
  }
  deleteFirstDocumentByQuery(query) {
    let doc2 = this.findFirst(query);
    if (!doc2) return false;
    __privateMethod(this, _PrismarineDBTable_instances, invokeEvent_fn).call(this, "$delete", { method: "DELETE_BY_QUERY_FIRST", docIndex, id });
    return this.deleteDocumentByID(doc2.id);
  }
  getByID(id2) {
    let docIndex2 = this.data.findIndex((document) => document.id == id2);
    if (docIndex2 < 0) return null;
    return this.data[docIndex2];
  }
  createKeyValDocument(id2) {
    if (this.findFirst({ __keyval_id: id2 })) return;
    return this.insertDocument({
      type: "__keyval__",
      __keyval_data: {},
      __keyval_id: id2
    });
  }
  keyval(id2) {
    return new Promise((resolve, reject)=>{
      let interval = system.runInterval(()=>{
        if(!this.loaded) return;
        let doc2 = this.findFirst({ __keyval_id: id2 });
        let docID = null;
        
        if (!doc2) {
          docID = this.createKeyValDocument(id2);
        } else {
          docID = doc2.id;
        }
        system.clearRun(interval)
        resolve(__privateMethod(this, _PrismarineDBTable_instances, keyval_fn).call(this, docID));
    
      }, 1)
    })
  }

  waitLoad() {
    return new Promise((resolve, reject)=>{
      let interval = system.runInterval(()=>{
        if(!this.loaded) return;
        system.clearRun(interval)
        resolve(true);    
      }, 1)
    })
  }
    
  trashDocumentByID(id2) {
    // this.loadTrash();
    // this.load();
    let data = this.getByID(id2);
    if (data) {
      let newData = JSON.parse(JSON.stringify(data));
      newData.expirationDate = Date.now() + 1e3 * 60 * 60 * 24 * 30;
      this.trash.push(newData);
      this.deleteDocumentByID(id2);
      this.save();
      this.saveTrash(newData);
    }
  }
  getTrashedDocumentByID(id2) {
    // this.loadTrash();
    // this.load();
    let docIndex2 = this.trash.findIndex((document) => document.id == id2);
    if (docIndex2 < 0) return null;
    return this.trash[docIndex2];
  }
  getTrashedDocuments() {
    for (const trash of this.trash) {
      if (Date.now() >= trash.expirationDate) this.deleteTrashedDocumentByID(trash.id);
    }
    return this.trash;
  }
  deleteTrashedDocumentByID(id2) {
    let docIndex2 = this.trash.findIndex((document) => document.id == id2);
    if (docIndex2 < 0) return false;
    this.trash.splice(docIndex2, 1);
    this.saveTrash();
    this.save();
    return true;
  }
  untrashDocumentByID(id2) {
    let data = this.getTrashedDocumentByID(id2);
    if (data) {
      this.data.push(data);
      this.deleteTrashedDocumentByID(id2);
      this.save();
      this.saveTrash();
    }
  }
  onUpdate(fn) {
    this.updateEvents.push(fn);
  }
};
_storage = new WeakMap();
_PrismarineDBTable_instances = new WeakSet();
genID_fn = function () {
    // Current timestamp (in milliseconds)
    const timestamp = Date.now();

    // Random number to add more uniqueness (between 0 and 999)
    const randomPart = Math.floor(Math.random() * 1000);

    // Combine the timestamp and random part (shift the random part for uniqueness)
    const uniqueId = timestamp * 1000 + randomPart;

    return uniqueId;
};
invokeEvent_fn = function (...args) {
  for (const namespace in eventHandlers) {
    if (namespace.startsWith("+PRISM:")) {
      eventHandlers[namespace].emit(...args);
    }
  }
};
keyval_fn = function (id2) {
  const get2 = (key, defaultValue = null) => {
    if(!this.loaded) return defaultValue ?? "";
    let doc2 = this.getByID(id2);
    if (!doc2) return defaultValue ?? null;
    let val = doc2.data.__keyval_data[key] ? doc2.data.__keyval_data[key].data : null;
    if (defaultValue != null && !val) return defaultValue;
    return val;
  };

  const set = (key, val) => {
    if(!this.loaded) return;
    let doc2 = this.getByID(id2);
    if (!doc2) return;
    let currentValue = doc2.data.__keyval_data[key] ? doc2.data.__keyval_data[key].data : null;
    let newValue = {};
    if (currentValue && currentValue.createdAt) {
      newValue.createdAt = currentValue.createdAt;
    } else {
      newValue.createdAt = Date.now();
    }
    newValue.updatedAt = Date.now();
    newValue.data = val;
    doc2.data.__keyval_data[key] = newValue;
    this.overwriteDataByID(doc2.id, doc2.data);
  };

  const del = (key) => {
    if(!this.loaded) return;
    let doc2 = this.getByID(id2);
    if (doc2.data.__keyval_data[key]) delete doc2.data.__keyval_data[key];
  };

  const has2 = (key) => {
    if(!this.loaded) return false;
    let doc2 = this.getByID(id2);
    if (doc2.data.__keyval_data.hasOwnProperty(key)) {
      return true;
    } else {
      return false;
    }
  };

  const keys2 = (key) => {
    if(!this.loaded) return []
    let doc2 = this.getByID(id2);
    return Object.keys(doc2.data.__keyval_data);
  };

  return { get: get2, set, delete: del, has: has2, keys: keys2 };
};
updateEvent_fn = function () {
  for (const event of this.updateEvents) {
    event();
  }
};
var eventHandlers = {};
var EventHandler = class {
  constructor(namespace) {
    this.killed = false;
    this.events = [];
    this.namespace = namespace;
    this.attachedToDb = false;
  }
  attachToDb(table) {
    table.onUpdate(() => {
      if (!this.killed)
        this.emit("$DB_UPDATE", table);
    });
    this.attachedToDb = true;
  }
  emitToHandler(namespace, event, ...args) {
    if (namespace.startsWith("+PRISM:")) throw new Error("Cant emit to reserved handlers");
    if (eventHandlers[namespace] && !eventHandlers[namespace].killed)
      eventHandlers[namespace].emit(`${event}~${this.namespace}`, ...args);
  }
  emitToAllHandlers(event, ...args) {
    for (const namespace in eventHandlers) {
      if (namespace.startsWith("+PRISM:")) continue;
      if (eventHandlers[namespace].killed) continue;
      eventHandlers[namespace].emit(`${event}~${this.namespace}`, ...args);
    }
  }
  emit(event, ...args) {
    let eventName = event.split("~")[0];
    let eventFrom = event.split("~").length > 1 ? event.split("~")[1] : null;
    this.events.forEach((eventData, i) => {
      console.log(eventData);
      if (eventData.name != eventName && eventData.name != "$ALL") return;
      if (eventData.name == eventName) {
        if (eventData.name == "$ALL") {
          eventData.handle.call({
            from: eventFrom
          }, eventName, ...args);
          if (eventData.once) this.events.splice(i, 1);
          return;
        }
        eventData.handle.call({
          from: eventFrom
        }, ...args);
        if (eventData.once) this.events.splice(i, 1);
      }
    });
  }
  killEventHandler() {
    this.events = [];
    this.killed = true;
    this.attachedToDb = false;
  }
  on(event, fn) {
    this.events.push({
      name: event,
      handle: fn,
      once: false
    });
  }
  onDbUpdate(fn) {
    if (!this.attachedToDb) throw new Error("You cant check for DB updates before attaching a DB");
    this.events.push({
      name: "$DB_UPDATE",
      handle: fn,
      once: false
    });
  }
  onAll(fn) {
    this.events.push({
      name: "$ALL",
      handle: fn,
      once: false
    });
  }
  once(fn) {
    this.events.push({
      name: "all",
      handle: fn,
      once: true
    });
  }
};
var ExtensionRegistry = class {
  constructor(name) {
    __privateAdd(this, _ExtensionRegistry_instances);
    this.extensionName = name;
    this.handler = new EventHandler(`+PRISM:${name}`);
    eventHandlers[`+PRISM:${name}`] = this.handler;
    this.onInsert = () => {
    };
    this.onDelete = () => {
    };
    __privateMethod(this, _ExtensionRegistry_instances, initialize_fn).call(this);
  }
  onInsert(fn) {
    this.onInsert = fn;
  }
  onDelete(fn) {
    this.onDelete = fn;
  }
};
_ExtensionRegistry_instances = new WeakSet();
initialize_fn = function () {
  this.handler.on("$insert", (...args) => {
    this.onInsert(...args);
  });
  this.handler.on("$delete", (...args) => {
    this.onDelete(...args);
  });
};
var FunctionStore = class {
  constructor(name) {
    __privateAdd(this, _funcs);
    __privateAdd(this, _groupName);
    __privateSet(this, _funcs, /* @__PURE__ */ new Map());
    __privateSet(this, _groupName, name);
  }
  add(name, fn) {
    __privateGet(this, _funcs).set(name, fn);
  }
  getList() {
    return __privateGet(this, _funcs).keys();
  }
  call(name, ...args) {
    if (!__privateGet(this, _funcs).has(name)) throw new Error(`Error: No function named "${name}" in ${__privateGet(this, _groupName)}""`);
    return __privateGet(this, _funcs).get(name)(...args);
  }
};
_funcs = new WeakMap();
_groupName = new WeakMap();
var FunctionStoreMain = class {
  constructor() {
    __privateAdd(this, _stores);
    __privateSet(this, _stores, []);
  }
  getStore(name) {
    if (__privateGet(this, _stores)[name]) return __privateGet(this, _stores)[name];
    __privateGet(this, _stores)[name] = new FunctionStore(name);
    return __privateGet(this, _stores)[name];
  }
};
_stores = new WeakMap();
function isVec3(obj) {
  return typeof obj === "object" && !Array.isArray(obj) && obj.hasOwnProperty("x") && typeof obj.x === "number" && obj.hasOwnProperty("y") && typeof obj.y === "number" && obj.hasOwnProperty("z") && typeof obj.z === "number";
}
function vec3toString(obj) {
  return `${obj.x},${obj.y},${obj.z}`;
}
function stringToVec3(str) {
  return {
    x: parseFloat(str.split(",")[0]),
    y: parseFloat(str.split(",")[1]),
    z: parseFloat(str.split(",")[2])
  };
}
function filterVec3(obj) {
  if (!isVec3(obj)) return;
  return {
    x: obj.x,
    y: obj.y,
    z: obj.z
  };
}
var PositionalDB = class {
  constructor(table = "default") {
    __privateAdd(this, _table2);
    __privateSet(this, _table2, table);
  }
  getPosition(obj) {
    if (!isVec3(obj)) return;
    let get2 = (key) => {
      let data = {};
      try {
        data = JSON.parse(world4.getDynamicProperty(`prismarine_positionaldb_${__privateGet(this, _table2)}:${vec3toString(obj)}`));
      } catch {
        data = {};
      }
      if (!data || data == {}) data = {};
      if (data.hasOwnProperty(key)) return data[key];
      return null;
    };
    let set = (key, val) => {
      let data = {};
      try {
        data = JSON.parse(world4.getDynamicProperty(`prismarine_positionaldb_${__privateGet(this, _table2)}:${vec3toString(obj)}`));
      } catch {
        data = {};
      }
      if (!data || data == {}) data = {};
      data[key] = val;
      system.run(()=>{
        world4.setDynamicProperty(`prismarine_positionaldb_${__privateGet(this, _table2)}:${vec3toString(obj)}`, JSON.stringify(data));

      })
    };
    let deleteValue = (key) => {
      let data = {};
      try {
        data = JSON.parse(world4.getDynamicProperty(`prismarine_positionaldb_${__privateGet(this, _table2)}:${vec3toString(obj)}`));
      } catch {
        data = {};
      }
      if (!data || data == {}) data = {};
      if (data.hasOwnProperty(key)) delete data[key];
      system.run(()=>{
        world4.setDynamicProperty(`prismarine_positionaldb_${__privateGet(this, _table2)}:${vec3toString(obj)}`, JSON.stringify(data));

      })
    };
    let has2 = (key) => {
      let data = {};
      try {
        data = JSON.parse(world4.getDynamicProperty(`prismarine_positionaldb_${__privateGet(this, _table2)}:${vec3toString(obj)}`));
      } catch {
        data = {};
      }
      if (!data || data == {}) data = {};
      return data.hasOwnProperty(key);
    };
    return { set, has: has2, get: get2, delete: deleteValue };
  }
};
_table2 = new WeakMap();
var PermissionSystem = class {
  constructor() {
    __privateAdd(this, _db);
    __privateAdd(this, _defaultPermissions);
    __privateSet(this, _db, new PrismarineDBTable("+PRISM:perms", new WorldPersistentStorage()));
    __privateGet(this, _db).waitLoad().then(res=>{
      if (!__privateGet(this, _db).findFirst({ type: "ROLE", default: true })) {
        __privateGet(this, _db).insertDocument({
          type: "ROLE",
          default: true,
          defaultAdmin: false,
          isAdmin: false,
          permissions: [],
          edited: false,
          tag: "default"
        });
      }
      if (!__privateGet(this, _db).findFirst({ type: "ROLE", defaultAdmin: true })) {
        __privateGet(this, _db).insertDocument({
          type: "ROLE",
          default: false,
          defaultAdmin: true,
          isAdmin: true,
          permissions: [],
          edited: false,
          tag: "admin"
        });
      }
  
    })
    __privateSet(this, _defaultPermissions, []);
  }
  setDefaultPermissions(newDefaultPerms) {
    __privateSet(this, _defaultPermissions, newDefaultPerms);
  }
  createRole(tag) {
    if (__privateGet(this, _db).findFirst({ type: "ROLE", tag })) throw new Error("Role already exists");
    __privateGet(this, _db).insertDocument({
      type: "ROLE",
      default: false,
      isAdmin: false,
      defaultAdmin: false,
      permissions: [],
      tag,
      edited: false
    });
  }
  getRole(tag) {
    return __privateGet(this, _db).findFirst({ type: "ROLE", tag });
  }
  getPerms(tag) {
    let perms = [];
    let role = this.getRole(tag);
    if (role) perms = role.perms;
    return perms;
  }
  setPerms(tag, perms) {
    let role = this.getRole(tag);
    if (!role) return;
    role.data.permissions = perms;
    role.data.edited = true;
    __privateGet(this, _db).overwriteDataByID(role.id, role.data);
  }
  setAdmin(tag, isAdmin2) {
    if (typeof isAdmin2 !== "boolean") return;
    let role = this.getRole(tag);
    if (!role) return;
    role.data.isAdmin = isAdmin2;
    role.data.edited = true;
    __privateGet(this, _db).overwriteDataByID(role.id, role.data);
  }
  setTag(tag, newTag) {
    if (__privateGet(this, _db).findFirst({ type: "ROLE", tag: newTag })) return;
    if (typeof isAdmin !== "boolean") return;
    if (tag === "default") return;
    let role = this.getRole(tag);
    if (!role) return;
    role.data.tag = newTag;
    role.data.edited = true;
    __privateGet(this, _db).overwriteDataByID(role.id, role.data);
  }
  deleteRole(tag) {
    let role = this.getRole(tag);
    if (!role) return;
    if (role.data.default || role.data.defaultAdmin) return;
    __privateGet(this, _db).deleteDocumentByID(role.id);
  }
  getRoles() {
    let roles = [];
    for (const role of __privateGet(this, _db).data) {
      roles.push(role.data);
    }
    return roles;
  }
  hasPermission(player, perm) {
    if(player.hasTag("admin") || player.isOp()) return true;
    let perms = [];
    for (const role of this.getRoles()) {
      if (player.hasTag(role.tag) || role.tag === "default") {
        if (role.default && !role.edited && __privateGet(this, _defaultPermissions).includes(perm)) return true;
        if (role.isAdmin) return true;
        perms.push(...role.permissions);
      }
    }
    return perms.includes(perm);
  }
};
_db = new WeakMap();
_defaultPermissions = new WeakMap();
var KeyValTemplate = class {
  /**
   * 
   * @param {string} key 
   * @returns {any}
   */
  get(key) {
  }
  /**
   * 
   * @param {string} key 
   * @param {any} value
   */
  set(key, value) {
  }
  /**
   * 
   * @param {string} key 
   * @returns {boolean}
   */
  has(key) {
  }
  /**
   * 
   * @param {string} key 
   */
  delete(key) {
  }
};
var stores = {};
var PrismarineDB = class {
  constructor() {
    __privateAdd(this, _PrismarineDB_instances);
    __privateAdd(this, _reservedTable);
    __privateAdd(this, _reservedKeyVal);
    __privateAdd(this, _reservedKeyVals);
    __privateAdd(this, _reservedEconomyTable);
    __privateSet(this, _reservedTable, new PrismarineDBTable("+PRISM:main", new WorldPersistentStorage()));
    __privateSet(this, _reservedEconomyTable, new PrismarineDBTable("+PRISM:economy", new WorldPersistentStorage()));
    __privateSet(this, _reservedKeyVal, __privateGet(this, _reservedTable).keyval("+PRISM:reserved"));
    __privateSet(this, _reservedKeyVals, {
      _main: __privateGet(this, _reservedKeyVal)
    });
    this.permissions = new PermissionSystem();
    this.version = 11.0;
    this.economy = new Economy(__privateGet(this, _reservedEconomyTable));
    this.config = this.keyval("conf");
  }
  sendToAllTables(msg) {
    for(const table of databaseTables) {
      table(msg)
    }
  }
  /**
   * 
   * @param {*} name 
   * @returns {Promise<KeyValTemplate>}
   */
  async keyval(name) {
    if (name.startsWith("+PRISM:")) throw new Error("Keyval names starting with '+PRISM:' are reserved");
    if (__privateGet(this, _reservedKeyVals)[name]) return __privateGet(this, _reservedKeyVals)[name];
    __privateGet(this, _reservedKeyVals)[name] = await __privateGet(this, _reservedTable).keyval(name);
    return __privateGet(this, _reservedKeyVals)[name];
  }
  table(name) {
    if (name.startsWith("+PRISM:")) throw new Error("Database names starting with '+PRISM:' are reserved");
    let session = new PrismarineDBTable(name, new WorldPersistentStorage());
    sessions[generateUUID()] = session;
    return session;
  }
  entityTable(name, entity) {
    if (name.startsWith("+PRISM:")) throw new Error("Database names starting with '+PRISM:' are reserved");
    let session = new PrismarineDBTable(name, new EntityPersistentStorage(entity));
    sessions[generateUUID()] = session;
    return session;
  }
  nonPersistentTable(name) {
    if (name.startsWith("+PRISM:")) throw new Error("Database names starting with '+PRISM:' are reserved");
    let session = new PrismarineDBTable(name, new NonPersistentStorage());
    sessions[generateUUID()] = session;
    return session;
  }
  scoreboardStorage(name) {
    if (name.startsWith("+PRISM:")) throw new Error("Database names starting with '+PRISM:' are reserved");
    let session = new PrismarineDBTable(name, new ScoreboardPersistentStorage());
    sessions[generateUUID()] = session;
    return session;
  }
  customStorage(name, Storage, ...params) {
    if (name.startsWith("+PRISM:")) throw new Error("Database names starting with '+PRISM:' are reserved");
    let session = new PrismarineDBTable(name, new Storage(...params));
    sessions[generateUUID()] = session;
    return session;
  }
  /**
   * 
   * @param {string} namespace 
   * @returns {EventHandler}
   */
  getEventHandler(namespace) {
    if (!eventHandlers[namespace] || eventHandlers[namespace] && eventHandlers[namespace].killed) {
      let eventHandler = new EventHandler(namespace);
      eventHandlers[namespace] = eventHandler;
      return eventHandler;
    }
    return eventHandlers[namespace];
  }
  convertBetweenStorageTypes(table, config1, config2) {
    let db1 = new PrismarineDBTable(table, new (__privateMethod(this, _PrismarineDB_instances, getStorage_fn))(config1.storage, ...config1.params ? config1.params : []));
    db1.load();
    let db2 = new PrismarineDBTable(table, new (__privateMethod(this, _PrismarineDB_instances, getStorage_fn))(config2.storage, ...config2.params ? config2.params : []));
    db2.data = db1.data;
    db2.save();
  }
  registerStore(storeClass, ...args) {
    let store = new storeClass(...args);
    if (!store.name) return;
    stores[store.name] = store;
  }
};
_reservedTable = new WeakMap();
_reservedKeyVal = new WeakMap();
_reservedKeyVals = new WeakMap();
_reservedEconomyTable = new WeakMap();
_PrismarineDB_instances = new WeakSet();
getStorage_fn = function (storage) {
  if (typeof storage === "string") {
    switch (storage) {
      case "entity":
        return EntityPersistentStorage;
      case "world":
        return WorldPersistentStorage;
    }
  }
  return storage;
};
var DeleteMethods = {
  DeleteByID: "DELETE_BY_ID",
  DeleteByQueryFirst: "DELETE_BY_QUERY_FIRST"
};
var prismarineDb = new PrismarineDB();
prismarineDb.registerStore(WorldPersistentStorage);
prismarineDb.registerStore(ScoreboardPersistentStorage);
var ColorAPI = class {
  constructor() {
    __privateAdd(this, _variants);
    __privateSet(this, _variants, /* @__PURE__ */ new Map([
      [
        "\xA70",
        {
          darker: "\xA70",
          lighter: "\xA78"
        }
      ],
      [
        "\xA71",
        {
          darker: "\xA71",
          lighter: "\xA79"
        }
      ],
      [
        "\xA72",
        {
          darker: "\xA72",
          lighter: "\xA7a"
        }
      ],
      [
        "\xA73",
        {
          darker: "\xA73",
          lighter: "\xA7b"
        }
      ],
      [
        "\xA74",
        {
          darker: "\xA74",
          lighter: "\xA7c"
        }
      ],
      [
        "\xA75",
        {
          darker: "\xA75",
          lighter: "\xA7d"
        }
      ],
      [
        "\xA76",
        {
          darker: "\xA76",
          lighter: "\xA7e"
        }
      ],
      [
        "\xA77",
        {
          darker: "\xA77",
          lighter: "\xA7f"
        }
      ],
      [
        "\xA78",
        {
          darker: "\xA78",
          lighter: "\xA77"
        }
      ],
      [
        "\xA79",
        {
          darker: "\xA71",
          lighter: "\xA79"
        }
      ],
      [
        "\xA7a",
        {
          darker: "\xA72",
          lighter: "\xA7a"
        }
      ],
      [
        "\xA7b",
        {
          darker: "\xA73",
          lighter: "\xA7b"
        }
      ],
      [
        "\xA7c",
        {
          darker: "\xA74",
          lighter: "\xA7c"
        }
      ],
      [
        "\xA7d",
        {
          darker: "\xA75",
          lighter: "\xA7d"
        }
      ],
      [
        "\xA7e",
        {
          darker: "\xA76",
          lighter: "\xA7e"
        }
      ],
      [
        "\xA7f",
        {
          darker: "\xA77",
          lighter: "\xA7f"
        }
      ],
      [
        "\xA7g",
        {
          darker: "\xA76",
          lighter: "\xA7g"
        }
      ],
      [
        "\xA7h",
        {
          darker: "\xA78",
          lighter: "\xA7h"
        }
      ],
      [
        "\xA7i",
        {
          darker: "\xA78",
          lighter: "\xA7i"
        }
      ],
      [
        "\xA7j",
        {
          darker: "\xA7j",
          lighter: "\xA7h"
        }
      ],
      [
        "\xA7m",
        {
          darker: "\xA7m",
          lighter: "\xA7c"
        }
      ],
      [
        "\xA7n",
        {
          darker: "\xA7m",
          lighter: "\xA7n"
        }
      ],
      [
        "\xA7p",
        {
          darker: "\xA7p",
          lighter: "\xA7e"
        }
      ],
      [
        "\xA7q",
        {
          darker: "\xA7q",
          lighter: "\xA7a"
        }
      ],
      [
        "\xA7s",
        {
          darker: "\xA7s",
          lighter: "\xA7b"
        }
      ],
      [
        "\xA7t",
        {
          darker: "\xA7t",
          lighter: "\xA7s"
        }
      ],
      [
        "\xA7u",
        {
          darker: "\xA7u",
          lighter: "\xA7d"
        }
      ]
    ]));
  }
  getColorCodes() {
    return [
      "\xA70",
      "\xA71",
      "\xA72",
      "\xA73",
      "\xA74",
      "\xA75",
      "\xA76",
      "\xA77",
      "\xA78",
      "\xA79",
      "\xA7a",
      "\xA7b",
      "\xA7c",
      "\xA7d",
      "\xA7e",
      "\xA7f",
      "\xA7g",
      "\xA7h",
      "\xA7i",
      "\xA7j",
      "\xA7m",
      "\xA7n",
      "\xA7p",
      "\xA7q",
      "\xA7s",
      "\xA7t",
      "\xA7u"
    ];
  }
  getColorNames() {
    return [
      "Black",
      "Dark Blue",
      "Dark Green",
      "Dark Aqua",
      "Dark Red",
      "Dark Purple",
      "Gold",
      "Dark Gray",
      "Blue",
      "Green",
      "Aqua",
      "Red",
      "Light Purple",
      "Yellow",
      "White",
      "Minecoin Gold",
      "Material Quartz",
      "Material Iron",
      "Material Netherite",
      "Material Redstone",
      "Material Copper",
      "Material Gold",
      "Material Diamond",
      "Material Lapis",
      "Material Amethyst"
    ];
  }
  getColorNamesColored() {
    let names = [];
    let colorNames = this.getColorNames();
    let colorCodes = this.getColorCodes();
    for (let i = 0; i < colorNames.length; i++) {
      names.push(`${colorCodes[i]}${colorNames[i]}`);
    }
  }
  isValidColorCode(code) {
    return this.getColorCodes().includes(code);
  }
  keyToColorCode(key) {
    if (key < 0) return this.getColorCodes()[0];
    if (key >= this.getColorCodes().length) return this.getColorCodes()[this.getColorCodes().length - 1];
    return this.getColorCodes()[key];
  }
  colorCodeToKey(code) {
    if (!this.isValidColorCode(code)) return 0;
    return this.getColorCodes().indexOf(code);
  }
  getVariants(code) {
    if (!this.isValidColorCode(code)) return __privateGet(this, _variants).get("\xA70");
    return __privateGet(this, _variants).get(code);
  }
};
_variants = new WeakMap();
var Player = class {
  getFirstTagStartingWithPrefix(player, prefix, removePrefix = false) {
    let tag = player.getTags().find((_2) => _2.startsWith(prefix));
    if (tag) {
      return removePrefix ? tag.substring(prefix.length) : tag;
    } else {
      return null;
    }
  }
  getTagsStartingWithPrefix(player, prefix, removePrefix = false) {
    let tags = player.getTags().filter((_2) => _2.startsWith(prefix));
    if (tags && tags.length) {
      return removePrefix ? tags.map((tag) => tag.substring(prefix.length)) : tags;
    } else {
      return [];
    }
  }
};
var playerAPI = new Player();
var colors = new ColorAPI();
var positionalDb = new PositionalDB();
var functionStore = new FunctionStoreMain();
export {
  ActionForm,
  DeleteMethods,
  EntityPersistentStorage,
  ExtensionRegistry,
  ModalForm,
  NonPersistentStorage,
  ScoreboardPersistentStorage,
  WorldPersistentStorage,
  colors,
  filterVec3,
  functionStore,
  isVec3,
  playerAPI,
  positionalDb,
  prismarineDb
};
