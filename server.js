const Express = require('express');
const app = new Express();
const path = require('path');
const config = require('./config');
const controllers = require('./controllers');

app.use(Express.static(path.join(__dirname, 'dist')));
app.use('/download', Express.static(path.join(__dirname, 'data/downloadable')));

app.get('/matches', controllers.matches);
app.get('/teams/search', controllers.teamSearch);
app.get('/teams', controllers.teams);
app.get('/team/:team', controllers.team);

app.listen(config.port, () => console.log(`Listening on port ${config.port}...`));