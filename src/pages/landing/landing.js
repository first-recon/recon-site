import * as G from '../../lib/helpers/g.js';
import config from '../../../config';

import style from './landing.css';

import TeamList from '../../lib/components/team-list';

var searchBoxId = 'searchBox';

export default function () {

	var landingHTML = require('./landing.html');

	document.title = 'Recon FTC Scouting';

	return G.inject(landingHTML, {
		'events': G.attachEvents('searchBox', { onkeyup: onSearchBoxKeyUp })
	});
}

function onSearchBoxKeyUp(event) {
	if (event.keyCode === 13) {
		_search_teams(event.target.value)
			.then(function (response) {
				teamList.innerHTML = TeamList(response.results);
			});
	}
}

function _search_teams(team) {
	return new Promise(function (res, rej) {
		fetch(!team ? '/teams' : '/teams/search?q=' + team)
			.then(function (response) {
				return response.json();
			})
			.then(function (ts) {
				res(ts);
			});
	});
}

G.onNewElement('teamList', function (teamList) {
	_search_teams()
		.then(function (response) {
			teamList.innerHTML = TeamList(response.results);
		});
});