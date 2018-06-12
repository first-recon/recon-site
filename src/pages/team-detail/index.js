import * as G from '../../lib/helpers/g.js';

import style from './team-detail.css';

import MatchList from '../../lib/components/match-list';

export default function () {

    var teamDetailHTML = require('./team-detail.html');
    
    document.title = 'Team Detail | Recon FTC Scouting';

	return G.inject(teamDetailHTML);
}

G.onNewElement('teamDetail', function (teamDetail) {
    var teamNum = window.location.hash.split('/')[2];
    fetch('/team/' + teamNum)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            if (response.success) {
                var team = response.result;
                G.get('#teamName').innerHTML = team.name;
                G.get('#teamNumber').innerHTML = team.number;
                G.get('#matchList').innerHTML = team.events.length ? MatchList(team.events) : 'No matches found :(';
            }
        });
});