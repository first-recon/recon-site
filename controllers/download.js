const fs = require('fs');

function createDownloadController() {
    return (req, res) => {
        res.download(__dirname + '/recon.apk');
    };
}

module.exports = {
    createDownloadController
};