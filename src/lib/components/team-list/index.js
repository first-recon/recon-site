import { inject } from '../../helpers/g';

import style from './team-list.css';

export default function TeamList(teams) {
    var teamHTML = require('./team-list.html');
    return teams.map(team => inject(teamHTML, team)).join('');
}