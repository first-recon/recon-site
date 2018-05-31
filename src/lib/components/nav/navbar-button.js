import { get, inject, attachEvents } from '../../helpers/g.js';

import style from './navbar-button.css';

export default function (id, text, events) {
	return inject(require('./navbar-button.html'), { id, text, events: attachEvents(id, events) });
}
