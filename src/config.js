var configFile = require('../config.json');

module.exports = {
    clientId: configFile.clientId,
    clientSecret: configFile.clientSecret,
    redirectUri: 'http://localhost:8899/handle-spotify-response',
    missingRequiredConfig: function() {
        return !this.clientId || !this.clientSecret || !this.redirectUri;
    }
};
