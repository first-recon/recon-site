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

export function onNewElement(id, callback) {
	newElementListeners.push({ id: id, callback: callback });
}

export function onRemovedElement(id, callback) {
	removedElementListeners.push({ id: id, callback: callback });
}

// Various Helper functions

export function attachEvents(id, events) {
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

export function get(selector) {
	return document.querySelector(selector);
}

export function inject(element, targets) {
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

export function keys(obj) {
	return obj ? Object.keys(obj) : [];
}

export function slice(collection) {
	return Array.prototype.slice.call(collection);
}

// Produces an array of generated components using a data list and a component constructor
export function generate(data, Component) {
	return data.map(function (obj) { return Component(obj) });
}

export function join(obj, obj2) {
	return Object.assign(obj, obj2);
}

// removes all whitespace from string
export function deleteWhitespace(str) {
	return str.replace(RegExp(/\s+/g), '')
}

export function navigate(base, currentHash, pages) {
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
