import Container from '../lib/components/container/container.js';

import Landing from './landing/landing.js';

export default {
	landing: {
		url: '',
		component: function () { return Container(Landing()) }
	}
}
