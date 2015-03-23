var spotify = require('./spotify'),
    playlistGenerator = require('./playlist-generator'),
    config = require('./config'),
    async = require('async');

module.exports = {
    loginOnSpotify: function(req, res) {
        res.redirect(spotify.getLoginUrl(config.clientId, config.redirectUri, 'user-library-read'));
    },
    handleSpotifyResponse: function(req, res) {
        if (req.query.error) {
            res.status(500).render('error.html', { error: 'Ocorreu um erro ao realizar o login com o Spotify: ' + req.query.error });
            return;
        }

        async.waterfall([
            function(callback) {
                spotify.getAccessToken(req.query.code, config.clientId, config.clientSecret, config.redirectUri, function(error, accessInfo) {
                    if (error) callback('Ocorreu um erro ao tentar obter o token de acesso');
                    else callback(null, accessInfo);
                });
            },
            function(accessInfo, callback) {
                spotify.getUserInfo(accessInfo.access_token, function(error, userInfo) {
                    if (error) callback('Ocorreu um erro ao tentar obter os dados do usuário');
                    else if (!userInfo.display_name) callback('O usuário informado não possui um nome configurado em seu perfil no Spotify');
                    else callback(null, accessInfo, userInfo);
                });
            },
            function(accessInfo, userInfo, callback) {
                var playlist = playlistGenerator(userInfo.display_name),
                    offset = 0,
                    limit = 50,
                    noMoreTracks = false;

                async.doUntil(
                    function(next) {
                        spotify.getUserTracks(accessInfo.access_token, limit, offset, function(error, tracks) {
                            if (error) next('Ocorreu um erro ao tentar obter as músicas do usuário');
                            else if (tracks.items.length === 0) {
                                noMoreTracks = true;
                                next();
                            }
                            else {
                                playlist.addTracks(tracks.items);
                                offset += limit;
                                next();
                            }
                        });
                    },
                    function() { return playlist.isComplete() || noMoreTracks },
                    function(error) {
                        if (error) callback(error);
                        else callback(null, {
                            username: userInfo.display_name,
                            tracks: playlist.getTracks(),
                            tracksProcessedCount: offset
                        });
                    }
                );
            }
        ], function(error, result) {
            if (error) res.status(500).render('error.html', { error: error });
            else res.render('playlist.html', result);
        });
    }
};
