module.exports = {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    missingRequiredConfig: function() {
        return !this.clientId || !this.clientSecret || !this.redirectUri;
    }
};
