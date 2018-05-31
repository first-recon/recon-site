import style from './match-entry.css';

export default function (match) {
    var matchEntry = require('./match-entry.html');

    var autoScore = match.data.rules.filter(r => r.period === 'autonomous').reduce((t, r) => t + r.points, 0);
    var teleopScore = match.data.rules.filter(r => r.period === 'teleop').reduce((t, r) => t + r.points, 0);
    var egScore = match.data.rules.filter(r => r.period === 'endgame').reduce((t, r) => t + r.points, 0);
    var totalScore = match.data.rules.reduce((t, r) => t + r.points, 0);

    return matchEntry
        .replace('{team-number}', match.team)
        .replace('{match-num}', match.matchid.split('-')[1])
        .replace('{autonomous-score}', autoScore)
        .replace('{teleop-score}', teleopScore)
        .replace('{endgame-score}', egScore)
        .replace('{total-score}', totalScore)
        .replace('{data}', match.data.rules.map(r => `<div class="match-rule">${r.name}: ${r.points}</div>`).join(''));
}