import MatchList from '../match-list';

import style from './match-period.css';

export default function (period, color, rules) {
    var matchPeriodHTML = require('./match-period.html');

    var renderedRules = rules.map(r => `<div class="match-rule">${r.name} <span>${r.points}</span></div>`).join('');

    return matchPeriodHTML
        .replace('{color}', color)
        .replace('{period-name}', period)
        .replace('{period-score}', rules.reduce((t, r) => t + r.points, 0))
        .replace('{matches}', renderedRules);
}