const Express = require('express');
const app = new Express();
const path = require('path');
const request = require('request');
const config = require('./config');

app.use(Express.static(path.join(__dirname, 'dist')));

app.get('/matches', (req, res) => {
    request('http://api.firstrecon.tech/matches', (err, response, body) => {
        res.send(body);
    });
});

app.listen(config.port, () => console.log(`Listening on port ${config.port}...`));