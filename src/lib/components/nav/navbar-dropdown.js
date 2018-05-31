import { inject, keys, attachEvents } from '../../helpers/g.js';

import style from './navbar-dropdown.css';

var dropdownHTML = require('./navbar-dropdown.html');
var dropdownLinkHTML = require('./navbar-dropdown-link.html');

export default function (id, text, options) {
	return inject(dropdownHTML, {
		id,
		text,
		options: genDropdownOptions(options)
	});
}

function genDropdownOptions(options) {
	return options.map(function (option) {
		return DropdownLink(option.id, option.label, option.events);
	}).join('');
}

function DropdownLink(id, label, events) {
	return inject(dropdownLinkHTML, {
		id,
		label,
		events: attachEvents(id, events)
	});
}
