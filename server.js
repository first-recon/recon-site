const Express = require('express');
const app = new Express();
const path = require('path');
const request = require('request');
const config = require('./config');

app.use(Express.static(path.join(__dirname, 'dist')));

app.get('/matches', (req, res) => {
    request(config.apis.match.url, (err, response, body) => {
        res.send(body);
    });
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

            const mergedResults = teamResponse.results.map(team => {
                return Object.assign({}, team, { numberOfMatches: matchCounts[team.number] || 0 });
            })
            .sort((a, b) => {
                if (a.numberOfMatches === b.numberOfMatches) {
                    return a.name > b.name;
                }
                return a.numberOfMatches < b.numberOfMatches
            });

            res.send(Object.assign({}, teamResponse, {
                results: mergedResults
            }));
        });
    });
});

app.get('/teams/search', (req, res) => {
    request(`${config.apis.team.url}/search?q=${req.query.q}`, (err, response, body) => {
        res.send(body);
    });
});

app.get('/team/:team', (req, res) => {
    request(`${config.apis.team.url}/${req.params.team}?includeMatches=true`, (err, response, body) => {
        res.send(body);
    });
});

app.listen(config.port, () => console.log(`Listening on port ${config.port}...`));