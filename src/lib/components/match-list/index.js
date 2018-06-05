import MatchEntry from '../match-entry';

export default function (matchData) {
	var matches = matchData.map(m => MatchEntry(m));

	return matches.join('');
}