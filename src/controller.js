var spotify = require('./spotify'),
    config = require('./config');

module.exports = {
    loginOnSpotify: function(req, res) {
        res.redirect(spotify.getLoginUrl(config.clientId, config.redirectUri, 'user-library-read'));
    },
    handleSpotifyResponse: function(req, res) {
        spotify.getAccessToken(req.query.code, config.clientId, config.clientSecret, config.redirectUri, function(error, response, body) {
            if (error && response.statusCode !== 200) {
               res.status(response.statusCode).send('Ocorreu um erro ao tentar obter o token de acesso');
               return;
            }

            var data = JSON.parse(body);
            res.status(200).send(data);
        });
    }
};
