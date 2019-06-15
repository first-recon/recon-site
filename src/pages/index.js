import Container from '../lib/components/container/container.js';

import Landing from './landing/landing.js';
import TeamDetail from './team-detail';
import Download from './download/download';

export default {
	landing: {
		url: '',
		component: function () { return Container(Landing()) }
	},
	team: {
		url: /(team)\/\d+/,
		component: function () { return Container(TeamDetail()) }
	},
	download: {
		url: /(download)/,
		component: function () { return Container(Download()) }
	}
}
