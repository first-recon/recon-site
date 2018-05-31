import { inject, join, attachEvents } from '../../helpers/g.js';

import style from './navbar-input.css';

export default function (id, value, placeholder, eventHandlers) {
	var params = join({ id, value, placeholder, events: attachEvents(id, eventHandlers) });
	return inject(require('./navbar-input.html'), params);
}
