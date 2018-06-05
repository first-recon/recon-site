const Express = require('express');
const app = new Express();
const path = require('path');
const request = require('request');
const config = require('./config');

app.get('/matches', (req, res) => {
    const clientURL = req.url.split('?')[1];
    request(config.apis.matches.url + `?${clientURL}`, (err, response, body) => {
        res.send(body);
    });
});

app.use(Express.static(path.join(__dirname, 'dist')));

app.listen(config.port, () => console.log(`Listening on port ${config.port}...`));