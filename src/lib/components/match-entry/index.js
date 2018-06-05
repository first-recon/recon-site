import style from './match-entry.css';

import MatchPeriod from '../match-period';

export default function (match) {
    var matchEntry = require('./match-entry.html');

    var autoMatches = match.data.rules.filter(r => r.period === 'autonomous');
    var teleopMatches = match.data.rules.filter(r => r.period === 'teleop');
    var endgameMatches = match.data.rules.filter(r => r.period === 'endgame');
    var totalScore = match.data.rules.reduce((t, r) => t + r.points, 0);

    var autoPeriod = MatchPeriod('Autonomous', 'rgb(150, 140, 0)', autoMatches);
    var teleopPeriod = MatchPeriod('Teleop', 'darkgreen', teleopMatches);
    var endgamePeriod = MatchPeriod('End Game', 'darkred', endgameMatches);

    return matchEntry
        .replace('{match-num}', match.number)
        .replace('{total-score}', totalScore)
        .replace('{data}', [autoPeriod, teleopPeriod, endgamePeriod].join(''));
}