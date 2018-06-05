import * as G from '../../lib/helpers/g.js';
import config from '../../../config';

import style from './landing.css';

import MatchList from '../../lib/components/match-list';

var _matches = [];

var searchBoxId = 'searchBox';

export default function () {

	var landingHTML = require('./landing.html');

	document.title = 'Recon FTC Scouting';

	return G.inject(landingHTML, {
		'id': searchBoxId,
		'events': G.attachEvents(searchBoxId, { onkeyup: onSearch })
	});
}

function onSearch(event) {
	if (event.keyCode === 13) {
		_get_matches(event.target.value)
			.then(function (response) {
				G.get('#matchList').innerHTML = MatchList(response.results);
			});
	}
}

function _get_matches(team='') {
	return new Promise(function (res, rej) {
		var url = config.apis.matches.proxy + (team.length ? '?team=' + team : '');
		fetch(url)
			.then(function (response) {
				return response.json();
			})
			.then(function (ms) {
				_matches = ms;
				res(_matches);
			});
	});
}

G.onNewElement('matchList', function (matchList) {
	_get_matches()
		.then(function (response) {
			matchList.innerHTML = MatchList(response.results);
		});
});