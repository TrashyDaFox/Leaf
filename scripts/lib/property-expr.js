/**
 * Based on Kendo UI Core expression code <https://github.com/telerik/kendo-ui-core#license-information>
 */
"use strict";

class Cache {
    constructor(maxSize) {
        this._maxSize = maxSize;
        this.clear();
    }

    clear() {
        this._size = 0;
        this._values = Object.create(null);
    }

    get(key) {
        return this._values[key];
    }

    set(key, value) {
        this._size >= this._maxSize && this.clear();
        if (!(key in this._values)) this._size++;

        return (this._values[key] = value);
    }
}

const SPLIT_REGEX = /[^.^\]^[]+|(?=\[\]|\.\.)/g,
    DIGIT_REGEX = /^\d+$/,
    LEAD_DIGIT_REGEX = /^\d/,
    SPEC_CHAR_REGEX = /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g,
    CLEAN_QUOTES_REGEX = /^\s*(['"]?)(.*?)(\1)\s*$/,
    MAX_CACHE_SIZE = 512;

const pathCache = new Cache(MAX_CACHE_SIZE),
    setCache = new Cache(MAX_CACHE_SIZE),
    getCache = new Cache(MAX_CACHE_SIZE);

function normalizePath(path) {
    return (
        pathCache.get(path) ||
        pathCache.set(
            path,
            split(path).map((part) => part.replace(CLEAN_QUOTES_REGEX, "$2"))
        )
    );
}

function split(path) {
    return path.match(SPLIT_REGEX) || [""];
}

function forEach(parts, iter, thisArg) {
    const len = parts.length;
    let part, idx, isArray, isBracket;

    for (idx = 0; idx < len; idx++) {
        part = parts[idx];

        if (part) {
            if (shouldBeQuoted(part)) {
                part = `"${part}"`;
            }

            isBracket = isQuoted(part);
            isArray = !isBracket && /^\d+$/.test(part);

            iter.call(thisArg, part, isBracket, isArray, idx, parts);
        }
    }
}

function isQuoted(str) {
    return typeof str === "string" && str && ["'", '"'].includes(str.charAt(0));
}

function hasLeadingNumber(part) {
    return part.match(LEAD_DIGIT_REGEX) && !part.match(DIGIT_REGEX);
}

function hasSpecialChars(part) {
    return SPEC_CHAR_REGEX.test(part);
}

function shouldBeQuoted(part) {
    return !isQuoted(part) && (hasLeadingNumber(part) || hasSpecialChars(part));
}

function setter(path) {
    const parts = normalizePath(path);

    return (
        setCache.get(path) ||
        setCache.set(path, function setter(obj, value) {
            let index = 0;
            const len = parts.length;
            let data = obj;

            while (index < len - 1) {
                const part = parts[index];
                if (
                    part === "__proto__" ||
                    part === "constructor" ||
                    part === "prototype"
                ) {
                    return obj;
                }

                data = data[parts[index++]];
            }
            data[parts[index]] = value;
        })
    );
}

function getter(path, safe) {
    const parts = normalizePath(path);
    return (
        getCache.get(path) ||
        getCache.set(path, function getter(data) {
            let index = 0;
            const len = parts.length;
            while (index < len) {
                if (data != null || !safe) data = data[parts[index++]];
                else return;
            }
            return data;
        })
    );
}

function join(segments) {
    return segments.reduce((path, part) => {
        return (
            path +
            (isQuoted(part) || DIGIT_REGEX.test(part)
                ? "[" + part + "]"
                : (path ? "." : "") + part)
        );
    }, "");
}

function forEachPath(path, cb, thisArg) {
    forEach(Array.isArray(path) ? path : split(path), cb, thisArg);
}

export {
    Cache,
    split,
    normalizePath,
    setter,
    getter,
    join,
    forEachPath as forEach,
};
