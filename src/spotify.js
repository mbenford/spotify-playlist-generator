var request = require('request'),
    util = require('util');

function defaultHandler(callback) {
    return function(error, response, body) {
        if (response.statusCode !== 200) {
            callback(error);
        }
        else {
            callback(null, JSON.parse(body));
        }
    }
}

module.exports = {
    getLoginUrl: function(clientId, responseUri, scope) {
        return util.format('https://accounts.spotify.com/authorize?client_id=%s&response_type=%s&redirect_uri=%s&scope=%s',
            clientId, 'code', encodeURIComponent(responseUri), scope);
    },
    getAccessToken: function(code, clientId, clientKey, responseUri, callback) {
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
        }, defaultHandler(callback));
    },
    getUserInfo: function(accessToken, callback) {
        request.get({
            url: 'https://api.spotify.com/v1/me',
            headers: {
                Authorization: 'Bearer ' + accessToken
            }
        }, defaultHandler(callback));
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
        }, defaultHandler(callback));
    }
};
