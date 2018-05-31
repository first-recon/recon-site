import { inject } from '../../helpers/g.js';

import style from './navbar-item.css';

export default function (text, target) {
	return inject(require('./navbar-item.html'), { text, target });
}
