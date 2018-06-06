import { inject } from '../../helpers/g';

import style from './team-list.css';

export default function TeamList(teams) {
    var teamHTML = require('./team-result.html');
    return teams.map(team => inject(teamHTML, Object.assign({}, team, {
        style: 'font-weight: ' + (team.numberOfMatches ? 'bold' : 'normal'),
        matchCounterText: team.numberOfMatches ? team.numberOfMatches : ''
    }))).join('');
}