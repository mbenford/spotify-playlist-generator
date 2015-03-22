var request = require('request'),
    util = require('util');

module.exports = {
    getLoginUrl: function(clientId, responseUri, scope) {
        return util.format('https://accounts.spotify.com/authorize?client_id=%s&response_type=%s&redirect_uri=%s&scope=%s',
            clientId, 'code', encodeURIComponent(responseUri), scope);
    },
    getAccessToken: function(code, responseUri, clientId, clientKey, callback) {
        request.post({
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                Authorization: 'Basic ' + new Buffer(clientId + ':' + clientKey).toString('base64')
            },
            form: {
                grant_type: 'authorization_code',
                code : code,
                redirect_uri: encodeURIComponent(responseUri)
            }
        }, callback);
    },
    getUserInfo: function(accessToken, callback) {
        request.get({
            url: 'https://api.spotify.com/v1/me',
            headers: {
                Authorization: 'Bearer ' + accessToken
            }
        }, callback);
    },
    getUserTracks: function(accessToken, limit, offset, callback) {
        request.get({
            url: 'https://api.spotify.com/v1/me/tracks',
            headers: {
                Authorization: 'Bearer ' + accessToken
            },
            qs: {
                limit: limit,
                offset: offset
            }
        }, callback);
    }
};
