/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(8);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (immutable) */ __webpack_exports__["d"] = onNewElement;
/* unused harmony export onRemovedElement */
/* unused harmony export attachEvents */
/* harmony export (immutable) */ __webpack_exports__["a"] = get;
/* harmony export (immutable) */ __webpack_exports__["b"] = inject;
/* unused harmony export keys */
/* harmony export (immutable) */ __webpack_exports__["e"] = slice;
/* unused harmony export generate */
/* unused harmony export join */
/* unused harmony export deleteWhitespace */
/* harmony export (immutable) */ __webpack_exports__["c"] = navigate;
/* New Element Listener Format
	{
		id: 'landing',
		callback: function () {
			console.log('found landing page');
		}
	}
 */
var newElementListeners = [];
var removedElementListeners = [];

var config = { attributes: true, childList: true, characterData: true };
var observer = new MutationObserver(function(mutations) {
	mutations.forEach(function (mutation) {
		var newNodes = [];
		_flatten(mutation.addedNodes, newNodes);
		listen(newElementListeners, newNodes);

		var removedNodes = [];
		_flatten(mutation.removedNodes, removedNodes);
		listen(removedElementListeners, removedNodes);
	});
});

function listen(listeners, nodes) {
	listeners.forEach(function (listener) {
		var node = nodes.find(function (node) {
			return node.id === listener.id;
		});

		if (node) {
			listener.callback(node);
		}
	});
}

// currentTreeLevel = an array of DOM nodes
function _flatten(currentTreeLevel, nodes) {
	// push each node on the current level
	for (var i = 0; i < currentTreeLevel.length; i++) {
		var currentNode = currentTreeLevel[i];
		// only add nodes with ids
		if (currentNode.id) {
			nodes.push(currentNode);
		}

		// if there are sub nodes, go down a level
		if (currentNode.children && currentNode.children.length) {
			_flatten(currentNode.children, nodes);
		}
	}
};

// Register for DOM mutation events
window.addEventListener("DOMContentLoaded", function () {
	observer.observe(get('#content'), config);
});

function onNewElement(id, callback) {
	newElementListeners.push({ id: id, callback: callback });
}

function onRemovedElement(id, callback) {
	removedElementListeners.push({ id: id, callback: callback });
}

// Various Helper functions

function attachEvents(id, events) {
	return _generate_event_html(_register_events(id, events));
}

// returns an object in the form { "eventname": eventHandler }
function _register_events(id, events) {
	var eventHandlerNames = {};
	keys(events).forEach(function (eventName) {
		var eventHandlerName = id + "_" + eventName; // eventName includes 'on'
		eventHandlerNames[eventName] = eventHandlerName;
		global[eventHandlerName] = events[eventName]; // events[name] = handler function
	});

	return eventHandlerNames;
}

function _generate_event_html(events) {
	var html = [];
	keys(events).forEach(function (eventName) {
		html.push(eventName + '="' + events[eventName] + '(event)"');
	});

	return html.join(' ');
}

function get(selector) {
	return document.querySelector(selector);
}

function inject(element, targets) {
	// is the element an html element or a string?
	var isHTML = !(typeof element === 'string');
	var base = isHTML ? element.innerHTML : element;

	var objectKeys = keys(targets);

	// key is target to be replaced
	objectKeys.forEach(function (target) {
		var component = targets[target];
		base = _inject_text(base, target, component);
	});

	return isHTML ? element.innerHTML = base : base;
}

function _inject_text(str, tar, comp) {
	return str.replace(RegExp('{' + tar + '}', 'g'), comp);
}

function keys(obj) {
	return obj ? Object.keys(obj) : [];
}

function slice(collection) {
	return Array.prototype.slice.call(collection);
}

// Produces an array of generated components using a data list and a component constructor
function generate(data, Component) {
	return data.map(function (obj) { return Component(obj) });
}

function join(obj, obj2) {
	return Object.assign(obj, obj2);
}

// removes all whitespace from string
function deleteWhitespace(str) {
	return str.replace(RegExp(/\s+/g), '')
}

function navigate(base, currentHash, pages) {
	var _nav = function (b, pg) {
		document.title = pg.title;
		b.innerHTML = pg.component()
	};

	keys(pages).forEach(function (page) {
		// match url with regex or string
		if (typeof pages[page].url === 'object') {
			if (pages[page].url.test(currentHash)) {
				_nav(base, pages[page]);
			}
		} else {
			if (_remove_hash(currentHash) == pages[page].url) {
				_nav(base, pages[page]);
			}
		}
	});
}

function _remove_hash(url) {
	var newHash = url.split('#')[1];
	switch(newHash) {
		case undefined:
			return '';
		default:
			return newHash;
	}
}

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(5)))

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers_g_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__navbar_css__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__navbar_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__navbar_css__);




/* harmony default export */ __webpack_exports__["a"] = (function (children) {
	return Object(__WEBPACK_IMPORTED_MODULE_0__helpers_g_js__["b" /* inject */])(__webpack_require__(9), { children });
});


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib_helpers_g_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__lib_components_nav_navbar_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__pages__ = __webpack_require__(10);




window.addEventListener('DOMContentLoaded', function() {
	Object(__WEBPACK_IMPORTED_MODULE_0__lib_helpers_g_js__["c" /* navigate */])(Object(__WEBPACK_IMPORTED_MODULE_0__lib_helpers_g_js__["a" /* get */])('#content'), window.location.hash, __WEBPACK_IMPORTED_MODULE_2__pages__["a" /* default */]);
});

window.onhashchange = function(e) {
	Object(__WEBPACK_IMPORTED_MODULE_0__lib_helpers_g_js__["c" /* navigate */])(Object(__WEBPACK_IMPORTED_MODULE_0__lib_helpers_g_js__["a" /* get */])('#content'), window.location.hash, __WEBPACK_IMPORTED_MODULE_2__pages__["a" /* default */]);
};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(7);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../node_modules/css-loader/index.js!./navbar.css", function() {
			var newContent = require("!!../../../../node_modules/css-loader/index.js!./navbar.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".navbar {\n\tbackground-color: black;\n\topacity: 0.8;\n\tmargin-bottom: 0;\n\tposition: relative;\n\theight: 50px;\n\tz-index: 1;\n}\n", ""]);

// exports


/***/ }),
/* 8 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = "<nav class=\"navbar\">\n\t{children}\n</nav>\n";

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib_components_container_container_js__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__landing_landing_js__ = __webpack_require__(32);




/* harmony default export */ __webpack_exports__["a"] = ({
	landing: {
		url: '',
		component: function () { return Object(__WEBPACK_IMPORTED_MODULE_0__lib_components_container_container_js__["a" /* default */])(Object(__WEBPACK_IMPORTED_MODULE_1__landing_landing_js__["a" /* default */])()) }
	}
});


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__container_css__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__container_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__container_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__nav_navbar_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__nav_navbar_container_js__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__nav_navbar_float_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__nav_navbar_item_js__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__logo_logo_js__ = __webpack_require__(27);









/* harmony default export */ __webpack_exports__["a"] = (function (generatedPage) {
	var generatedNavbar = Object(__WEBPACK_IMPORTED_MODULE_1__nav_navbar_js__["a" /* default */])(
		Object(__WEBPACK_IMPORTED_MODULE_2__nav_navbar_container_js__["a" /* default */])(
			Object(__WEBPACK_IMPORTED_MODULE_3__nav_navbar_float_js__["a" /* default */])('left', [Object(__WEBPACK_IMPORTED_MODULE_5__logo_logo_js__["a" /* default */])('#')])
		)
	);

	var containerHTML = __webpack_require__(31);
	containerHTML = containerHTML.replace('{navbar}', generatedNavbar);
	containerHTML = containerHTML.replace('{page}', generatedPage);
	return containerHTML;
});


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(13);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../node_modules/css-loader/index.js!./container.css", function() {
			var newContent = require("!!../../../../node_modules/css-loader/index.js!./container.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "body {\n\tfont-family: Helvetica;\n\tfont-size: 14px;\n\tmargin: 0;\n}\n", ""]);

// exports


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers_g_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__navbar_container_css__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__navbar_container_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__navbar_container_css__);




/* harmony default export */ __webpack_exports__["a"] = (function () {
	var children = Object(__WEBPACK_IMPORTED_MODULE_0__helpers_g_js__["e" /* slice */])(arguments).join('');
	return Object(__WEBPACK_IMPORTED_MODULE_0__helpers_g_js__["b" /* inject */])(__webpack_require__(17), { children });
});


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(16);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../node_modules/css-loader/index.js!./navbar-container.css", function() {
			var newContent = require("!!../../../../node_modules/css-loader/index.js!./navbar-container.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".navbar-container {\n\twidth: 100%;\n\theight: 100%;\n\tpadding-right: 15px;\n\tmargin-left: auto;\n\tmargin-right: auto;\n}\n", ""]);

// exports


/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = "<div class=\"navbar-container\">\n\t{children}\n</div>\n";

/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers_g_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__navbar_float_css__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__navbar_float_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__navbar_float_css__);




/* harmony default export */ __webpack_exports__["a"] = (function (floatDirection, children) {
	if (floatDirection === "center") {
		return Object(__WEBPACK_IMPORTED_MODULE_0__helpers_g_js__["b" /* inject */])(__webpack_require__(21), { 'children' : children.join('') });
	}

	return Object(__WEBPACK_IMPORTED_MODULE_0__helpers_g_js__["b" /* inject */])(__webpack_require__(22), {
		'floatDirection' : floatDirection,
		'children' : children.join('')
	});
});


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(20);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../node_modules/css-loader/index.js!./navbar-float.css", function() {
			var newContent = require("!!../../../../node_modules/css-loader/index.js!./navbar-float.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".navbar-float {\n\theight: 100%;\n}\n\n.navbar-float.center {\n\ttext-align: center;\n}\n", ""]);

// exports


/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = "<div class=\"navbar-float center\">\n\t{children}\n</div>\n";

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = "<div class=\"navbar-float\" style=\"float: {floatDirection}\">\n\t{children}\n</div>\n";

/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers_g_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__navbar_item_css__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__navbar_item_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__navbar_item_css__);




/* unused harmony default export */ var _unused_webpack_default_export = (function (text, target) {
	return Object(__WEBPACK_IMPORTED_MODULE_0__helpers_g_js__["b" /* inject */])(__webpack_require__(26), { text, target });
});


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(25);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../node_modules/css-loader/index.js!./navbar-item.css", function() {
			var newContent = require("!!../../../../node_modules/css-loader/index.js!./navbar-item.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "a.navbar-item {\n\tdisplay: inline-block;\n\tline-height: 50px;\n\theight: 100%;\n\tpadding: 0 12px;\n\ttext-decoration: none;\n\tvertical-align: top;\n\tcolor: white;\n}\n\na.navbar-item:hover {\n\ttransition: 0.3s background-color;\n    color: black;\n    background-color: white;\n}\n\n.navbar-float.center > a.navbar-item {\n\twidth: 70px;\n}\n", ""]);

// exports


/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = "<a class=\"navbar-item\" href=\"{target}\">{text}</a>\n";

/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers_g_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__logo_css__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__logo_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__logo_css__);




/* harmony default export */ __webpack_exports__["a"] = (function (target) {
	return Object(__WEBPACK_IMPORTED_MODULE_0__helpers_g_js__["b" /* inject */])(__webpack_require__(30), { target });
});


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(29);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../node_modules/css-loader/index.js!./logo.css", function() {
			var newContent = require("!!../../../../node_modules/css-loader/index.js!./logo.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "a.logo {\n\tdisplay: inline-block;\n\theight: 100%;\n\tpadding: 0 12px;\n\ttext-decoration: none;\n\tcolor: white;\n}\n\na.logo:hover {\n\ttransition: 0.3s background-color;\n    color: black;\n    background-color: white;\n}\n\na.logo > span {\n\tmargin-top: 10px;\n\tborder: 2px solid white;\n\tpadding: 0px 3px 0px 3px;\n\tfont-size: 22px;\n\tdisplay: inline-block;\n}\n a.logo > span:hover {\n\ttransition: 0.3s border-color;\n    border-color: black;\n }\n", ""]);

// exports


/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = "<a class=\"logo\" href=\"{target}\"><span>RECON</span></a>\n";

/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = "<div id=\"container\">\n\t{navbar}\n\t{page}\n</div>\n";

/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib_helpers_g_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__landing_css__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__landing_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__landing_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lib_components_match_list__ = __webpack_require__(35);






var _matches = [];

/* harmony default export */ __webpack_exports__["a"] = (function () {

	var landingHTML = __webpack_require__(43);

	document.title = 'Recon FTC Scouting';

	return __WEBPACK_IMPORTED_MODULE_0__lib_helpers_g_js__["b" /* inject */](landingHTML);
});

function _get_matches() {
	return new Promise(function (res, rej) {
		fetch('/matches')
			.then(function (response) {
				return response.json();
			})
			.then(function (ms) {
				_matches = ms;
				res(_matches);
			});
	});
}

__WEBPACK_IMPORTED_MODULE_0__lib_helpers_g_js__["d" /* onNewElement */]('matchList', function (matchList) {
	_get_matches()
		.then(function (matches) {
			__WEBPACK_IMPORTED_MODULE_0__lib_helpers_g_js__["b" /* inject */](matchList, { 'match-list': Object(__WEBPACK_IMPORTED_MODULE_2__lib_components_match_list__["a" /* default */])(matches) })
		});
});

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(34);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!./landing.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!./landing.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".center-page {\n\twidth: 720px;\n\tmargin: 20px auto 0 auto;\n}\n\n.page-heading {\n\tbackground-color: white;\n\twidth: 100%;\n\tpadding: 5px;\n\ttext-align: center;\n}\n\n.page-heading > h1 {\n\tcolor: black;\n\tborder-bottom: 1px solid black;\n}", ""]);

// exports


/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__match_list_css__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__match_list_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__match_list_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__match_entry__ = __webpack_require__(38);




/* harmony default export */ __webpack_exports__["a"] = (function (matchData) {
	var matchListHTML = __webpack_require__(42);

	var matches = matchData.map(m => Object(__WEBPACK_IMPORTED_MODULE_1__match_entry__["a" /* default */])(m));

	return matches.join('');
});

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(37);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../node_modules/css-loader/index.js!./match-list.css", function() {
			var newContent = require("!!../../../../node_modules/css-loader/index.js!./match-list.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__match_entry_css__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__match_entry_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__match_entry_css__);


/* harmony default export */ __webpack_exports__["a"] = (function (match) {
    var matchEntry = __webpack_require__(41);

    var autoScore = match.data.rules.filter(r => r.period === 'autonomous').reduce((t, r) => t + r.points, 0);
    var teleopScore = match.data.rules.filter(r => r.period === 'teleop').reduce((t, r) => t + r.points, 0);
    var egScore = match.data.rules.filter(r => r.period === 'endgame').reduce((t, r) => t + r.points, 0);
    var totalScore = match.data.rules.reduce((t, r) => t + r.points, 0);

    return matchEntry
        .replace('{team-number}', match.team)
        .replace('{match-num}', match.matchid.split('-')[1])
        .replace('{autonomous-score}', autoScore)
        .replace('{teleop-score}', teleopScore)
        .replace('{endgame-score}', egScore)
        .replace('{total-score}', totalScore)
        .replace('{data}', match.data.rules.map(r => `<div class="match-rule">${r.name}: ${r.points}</div>`).join(''));
});

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(40);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../node_modules/css-loader/index.js!./match-entry.css", function() {
			var newContent = require("!!../../../../node_modules/css-loader/index.js!./match-entry.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".match-entry-container {\n    text-align: left;\n    margin-bottom: 10px;\n}\n\n.match-entry {\n    color: black;\n}\n\n.match-rule-container {\n    margin-left: 10px;\n}\n\n.match-rule {\n    color: rgb(58, 58, 58);\n    font-size: 13px;\n    line-height: 15px;\n}", ""]);

// exports


/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports = "<div class=\"match-entry-container\">\n        <div class=\"match-entry\">{team-number} #{match-num} {total-score} - A{autonomous-score} T{teleop-score} E{endgame-score}</div>\n        <div class=\"match-rule-container\">{data}</div>\n</div>";

/***/ }),
/* 42 */
/***/ (function(module, exports) {

module.exports = "<div>this is a test</div>";

/***/ }),
/* 43 */
/***/ (function(module, exports) {

module.exports = "<div id=\"landing\" class=\"center-page\">\n\t<div class=\"page-heading\">\n\t\t<h1>Matches</h1>\n\t\t<div id=\"matchList\">\n\t\t\t{match-list}\n\t\t</div>\n\t</div>\n</div>\n";

/***/ })
/******/ ]);