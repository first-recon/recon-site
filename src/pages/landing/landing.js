import * as G from '../../lib/helpers/g.js';

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

const updateResults = (results) => teamList.innerHTML = TeamList(results, 'teamList');

function onSearchBoxKeyUp(event) {
	_search_teams(event.target.value, event.key === 13).then(updateResults);
}

let cachedTeamList = [];

function _search_teams(team, performNetworkSearch = true) {
	if (!performNetworkSearch) {
		return Promise.resolve(cachedTeamList.filter(({number}) => number.includes(team)));
	}

	return new Promise((res, rej) => {
		fetch(!team ? '/teams' : '/teams/search?q=' + team)
			.then((response) => response.json())
			.then(({ results }) => {
				cachedTeamList = results;
				res(results);
			})
			.catch(console.error);
	});
}

G.onNewElement('teamList', function (teamList) {
	_search_teams().then(updateResults);
});