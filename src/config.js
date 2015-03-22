var configFile = require('../config.json');

module.exports = {
    clientId: configFile.clientId,
    clientSecret: configFile.clientSecret,
    redirectUri: configFile.redirectUri,
    missingRequiredConfig: function() {
        return !this.clientId || !this.clientSecret || !this.redirectUri;
    }
};
