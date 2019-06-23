import { inject } from '../../helpers/g';

import style from './team-list.css';

const PAGE_SIZE = 50;

const render = (teams, template, numberToRender) =>  teams.slice(0, numberToRender).map(team => inject(template, {
    ...team,
    style: 'font-weight: ' + (team.numberOfMatches ? 'bold' : 'normal'),
})).join('')

export default function TeamList(teams, teamListId, paginationCallback) {

    const teamHTML = require('./team-result.html');

    let pagesToLoad = 1;

    window.onscroll = () => {
        const currentScrollLocationOfViewportBottom = window.scrollY + window.innerHeight;
        const list = document.getElementById(teamListId);

        if (list.offsetHeight <= currentScrollLocationOfViewportBottom) {
            pagesToLoad++;
            list.innerHTML = render(teams, teamHTML, PAGE_SIZE * pagesToLoad);
        }
    };

    return render(teams, teamHTML, PAGE_SIZE * 1);
}
