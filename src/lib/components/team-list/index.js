import { inject } from '../../helpers/g';

import style from './team-list.css';

export default function TeamList(teams) {
    const teamHTML = require('./team-result.html');
    return teams.map(team => inject(teamHTML, {
        ...team,
        style: 'font-weight: ' + (team.numberOfMatches ? 'bold' : 'normal'),
    })).join('');
}
