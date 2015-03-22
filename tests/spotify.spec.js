var proxyquire = require('proxyquire'),
    expect = require('expect.js'),
    sinon = require('sinon');

describe('spotify', function() {
    var sut, requestMock,
        noop = function() {};

    beforeEach(function() {
        requestMock = {};
        sut = proxyquire('../src/spotify', { request: requestMock });
    });

    describe('getLoginUrl', function() {
        it('retorna a url de login do Spotify', function() {
            // Act
            var url = sut.getLoginUrl('1234', 'http://localhost/callback', 'user-read');

            // Assert
            expect(url).to.be('https://accounts.spotify.com/authorize?client_id=1234&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%2Fcallback&scope=user-read');
        });
    });

    describe('getAccessToken', function() {
        it('faz uma requisição POST para obter o token de acesso', function() {
            // Arrange
            requestMock.post = sinon.spy();

            // Act
            sut.getAccessToken('1234', 'http://localhost/callback', 'ABC', 'XYZ', noop);

            // Assert
            expect(requestMock.post.calledOnce).to.be(true);
            expect(requestMock.post.args[0][0]).to.eql({
                url: 'https://accounts.spotify.com/api/token',
                headers: {
                    Authorization: 'Basic QUJDOlhZWg=='
                },
                form: {
                    grant_type: 'authorization_code',
                    code : '1234',
                    redirect_uri: 'http%3A%2F%2Flocalhost%2Fcallback'
                }
            });
        });
    });

    describe('getUserInfo', function() {
        it('faz uma requisição GET para obter os dados do usuário', function() {
            // Arrange
            requestMock.get = sinon.spy();

            // Act
            sut.getUserInfo('1234', noop);

            // Assert
            expect(requestMock.get.calledOnce).to.be(true);
            expect(requestMock.get.args[0][0]).to.eql({
                url: 'https://api.spotify.com/v1/me',
                headers: {
                    Authorization: 'Bearer 1234'
                }
            });
        });
    });

    describe('getUserTracks', function() {
        it('faz uma requisição GET para obter as faixas do usuário', function() {
            // Arrange
            requestMock.get = sinon.spy();

            // Act
            sut.getUserTracks('1234', 50, 1, noop);

            // Assert
            expect(requestMock.get.calledOnce).to.be(true);
            expect(requestMock.get.args[0][0]).to.eql({
                url: 'https://api.spotify.com/v1/me/tracks',
                headers: {
                    Authorization: 'Bearer 1234'
                },
                qs: {
                    limit: 50,
                    offset: 1
                }
            });
        });
    });
});