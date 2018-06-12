const Express = require('express');
const app = new Express();
const path = require('path');
const request = require('request-promise-native');
const config = require('./config');

app.use(Express.static(path.join(__dirname, 'dist')));

app.get('/matches', (req, res) => {
    request(config.apis.match.url).then(res.send);
});

app.get('/teams', (req, res) => {
    // TODO: promisify this
    request(config.apis.team.url, (err, response, body) => {
        const teamResponse = JSON.parse(body);

        // merge in match counts - this data is stored in the match api
        // TODO: add endpoint for getting this data directly from the match api
        request(config.apis.match.url, (matchError, matchResponse, matchBody) => {
            const matchCounts = JSON.parse(matchBody).results.reduce((counts, m) => {
                if (counts[m.team]) {
                    counts[m.team]++;
                } else {
                    counts[m.team] = 1;
                }
                return counts;
            }, {});

            const mergedResults = teamResponse.results ? teamResponse.results.map(team => {
                return Object.assign({}, team, { numberOfMatches: matchCounts[team.number] || 0 });
            })
            .sort((a, b) => {
                if (a.numberOfMatches === b.numberOfMatches) {
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return 1;
                    return 0;
                }
                return b.numberOfMatches - a.numberOfMatches;
            }) : [];

            res.send(Object.assign({}, teamResponse, {
                results: mergedResults
            }));
        });
    });
});

app.get('/teams/search', (req, res) => {
    request(`${config.apis.team.url}/search?q=${req.query.q}`).then(res.send);
});

app.get('/team/:team', (req, res) => {
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
});

app.listen(config.port, () => console.log(`Listening on port ${config.port}...`));