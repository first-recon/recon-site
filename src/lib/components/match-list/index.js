import MatchTournament from '../match-tournament';

export default function (tournaments) {
	return tournaments.map(t => MatchTournament(t)).join('');
}