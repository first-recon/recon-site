import { inject } from '../../helpers/g.js';

import style from './navbar-float.css';

export default function (floatDirection, children) {
	if (floatDirection === "center") {
		return inject(require('./navbar-float-center.html'), { 'children' : children.join('') });
	}

	return inject(require('./navbar-float.html'), {
		'floatDirection' : floatDirection,
		'children' : children.join('')
	});
}
