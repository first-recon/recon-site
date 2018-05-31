import style from './match-list.css';

import MatchEntry from '../match-entry';

export default function (matchData) {
	var matchListHTML = require('./match-list.html');

	var matches = matchData.map(m => MatchEntry(m));

	return matches.join('');
}