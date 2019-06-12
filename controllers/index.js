const GameConfig = require('../../recon-app/recon-lib').GameConfig;
const config = require('../config');
const request = require('request-promise-native');

function processTeamsAndMatches (teams, matches) {

    const calculateTotalMatchScore = (match) => GameConfig.calcScoresFromData(match.data).stats.total;

    const calcTotalSeasonScore = (runningTotal, matchTotal) => runningTotal + matchTotal;

    const teamStats = teams
        .map(team => {
            const matchesForTeam = matches.filter(m => String(m.team) === team.number);
            const totalPointsScoredInAllMatches = matchesForTeam
                .map(calculateTotalMatchScore)
                .reduce(calcTotalSeasonScore, 0);

            return {
                ...team,
                numberOfMatches: matchesForTeam.length,
                avgScore: totalPointsScoredInAllMatches / (matchesForTeam.length || 1)
            };
        });

    teamStats.sort((a, b) => {
        if (a.avgScore === b.avgScore) {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        }
        return b.avgScore - a.avgScore;
    });

    return teamStats;
}

module.exports = {
    matches: (req, res) => {
        request(config.apis.match.url).then(res.send);
    },
    teams: (req, res) => {
        // TODO: promisify this
        request(config.apis.team.url, (err, response, teamApiResponse) => {
    
            // merge in match counts - this data is stored in the match api
            // TODO: add endpoint for getting this data directly from the match api
            request(config.apis.match.url, (matchError, response, matchApiResponse) => {
                const parsedTeamApiResponse = JSON.parse(teamApiResponse);
                const parseMatchApiResponse = JSON.parse(matchApiResponse);
                if (!parsedTeamApiResponse.success || !parseMatchApiResponse.success) {
                    console.log(
                        'ERROR',
                        'team api response', parsedTeamApiResponse.success,
                        'match api resonse', parseMatchApiResponse.success
                    );
                    res.send({
                        success: false,
                        error: {
                            message: 'Could not communicate with server, please try again later... :('
                        }
                    });
                } else {
                    res.send({
                        success: true,
                        results: processTeamsAndMatches(parsedTeamApiResponse.results, parseMatchApiResponse.results)
                    });
                }
            });
        });
    },
    teamSearch: (req, res) => {
        Promise.all([
            request(`${config.apis.team.url}/search?q=${req.query.q}`),
            request(`${config.apis.match.url}?team=${req.query.q}`)
        ])
        .then(([teamApiResponse, matchesApiResponse]) => {
            const teams = JSON.parse(teamApiResponse);
            const matches = JSON.parse(matchesApiResponse);
            res.send({
                success: true,
                results: processTeamsAndMatches(teams.results, matches.results)
            });
        });
    },
    team: (req, res) => {
        Promise.all([
            request(`${config.apis.team.url}/${req.params.team}`),
            request(`${config.apis.match.url}?team=${req.params.team}`)
        ])
        .then(([teamJSON, matchesJSON]) => {
            const team = JSON.parse(teamJSON).result;
            const matches = JSON.parse(matchesJSON).results;
            const matchesIndexedByEvent = matches.reduce((t, m) => {
                const tId = m.matchid.split('-')[0];
                if (t[tId]) {
                    t[tId] = t[tId].concat(m);
                    return t;
                }
                t[tId] = [m];
                return t;
            }, {});
    
            Promise.all(Object.keys(matchesIndexedByEvent)
                .map(id => {
                    return request(`${config.apis.event.url}?id=${id}`)
                        .then((eventApiResponse) => {
                            const event = JSON.parse(eventApiResponse).results[0];
                            return Object.assign({}, event, { matches: matchesIndexedByEvent[id] });
                        });
                }))
                .then((hydratedMatches) => {
                    res.send({
                        success: true,
                        result: Object.assign({}, team, { events: hydratedMatches })
                    });
                });
        })
        .catch((error) => {
            res.status(500).send({ success: false, message: 'an unknown error occurred', error });
        });
    }
}