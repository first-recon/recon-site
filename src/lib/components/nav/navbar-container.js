import { inject, slice } from '../../helpers/g.js';

import style from './navbar-container.css';

export default function () {
	var children = slice(arguments).join('');
	return inject(require('./navbar-container.html'), { children });
}
