const packageConfig = require('../package.json');
const env = process.argv[2];

const config = require(`./${env || 'production'}.json`);

module.exports = !env || env === 'production' ? config[packageConfig.name] : config;
