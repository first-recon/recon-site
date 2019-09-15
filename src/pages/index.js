import Container from '../lib/components/container/container.js';

import Landing from './landing/landing.js';
import TeamDetail from './team-detail';
import Download from './download/download';
import About from './about/about';

export default {
	landing: {
		url: '',
		component: () => Container(Landing())
	},
	team: {
		url: /(team)\/\d+/,
		component: () => Container(TeamDetail())
	},
	download: {
		url: /(download)/,
		component: () => Container(Download())
	},
	about: {
		url: /(about)/,
		component: () => Container(About())
	}
}
