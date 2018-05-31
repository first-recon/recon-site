import { inject } from '../../helpers/g.js';

import style from './logo.css';

export default function (target) {
	return inject(require('./logo.html'), { target });
}
