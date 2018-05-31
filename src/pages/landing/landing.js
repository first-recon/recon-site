import * as G from '../../lib/helpers/g.js';

import style from './landing.css';

import MatchList from '../../lib/components/match-list';

var _matches = [];

export default function () {

	var landingHTML = require('./landing.html');

	document.title = 'Recon FTC Scouting';

	return G.inject(landingHTML);
}

function _get_matches() {
	return new Promise(function (res, rej) {
		fetch('/matches')
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
		.then(function (matches) {
			G.inject(matchList, { 'match-list': MatchList(matches) })
		});
});