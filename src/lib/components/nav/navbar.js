import { inject } from '../../helpers/g.js';

import style from './navbar.css';

export default function (children) {
	return inject(require('./navbar.html'), { children });
}
