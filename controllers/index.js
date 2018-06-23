const config = require('../config');
const request = require('request-promise-native');

function processTeamsAndMatches (teams, matches) {

    function reduceMatch (stats, m) {
        const matchTotal = m.data.rules.reduce((t, r) => t + r.points, 0);
        if (stats[m.team]) {
            stats[m.team] = {
                numberOfMatches: stats[m.team].numberOfMatches + 1,
                totalPoints: (stats[m.team].totalPoints + matchTotal)
            };
        } else {
            stats[m.team] = {
                numberOfMatches: 1,
                totalPoints: matchTotal
            };
        }
        return stats;
    }

    const collectedStats = matches.reduce(reduceMatch, {});
    const aggregatedStats = {};
    for (team in collectedStats) {
        const teamStats = collectedStats[team];
        aggregatedStats[team] = Object.assign(
            {}, 
            teamStats,
            { avgScore: teamStats.totalPoints / teamStats.numberOfMatches, totalPoints: undefined }
        );
    }

    const mergedResults = teams.map(team => {
        return Object.assign({}, team, {
            numberOfMatches: aggregatedStats[team.number] && aggregatedStats[team.number].numberOfMatches || 0,
            avgScore: aggregatedStats[team.number] && aggregatedStats[team.number].avgScore || 0
        });
    })
    .sort((a, b) => {
        if (a.avgScore === b.avgScore) {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        }
        return b.avgScore - a.avgScore;
    });

    return mergedResults;
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
                const teams = JSON.parse(teamApiResponse);
                const matches = JSON.parse(matchApiResponse);
                res.send({
                    success: true,
                    results: processTeamsAndMatches(teams.results, matches.results)
                });
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