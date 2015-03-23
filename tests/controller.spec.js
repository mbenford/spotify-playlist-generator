var expect = require('expect.js'),
    sinon = require('sinon'),
    proxyquire = require('proxyquire');

function waitForCompletion(done, callback) {
    setTimeout(function() {
        callback();
        done();
    }, 10);
}

describe('controller', function() {
    var sut, reqMock, resMock, spotifyMock;

    beforeEach(function() {
        reqMock = {};
        resMock = {};
        spotifyMock = {};

        sut = proxyquire('../src/controller', { './spotify': spotifyMock })
    });

    describe('loginOnSpotify', function() {
        it('redireciona a requisição para o login no Spotify', function() {
            // Arrange
            resMock.redirect = sinon.spy();
            spotifyMock.getLoginUrl = sinon.spy();

            // Act
            sut.loginOnSpotify(reqMock, resMock);

            // Assert
            expect(resMock.redirect.called).to.be(true);
            expect(spotifyMock.getLoginUrl.called).to.be(true);
        });
    });

    describe('handleSpotifyResponse', function() {
        beforeEach(function() {
            reqMock.query = {};
        });

        describe('casos de sucesso', function() {
            var artists = [ { name: 'Artista' }],
                album = { name: 'Album' };

            beforeEach(function() {
                resMock.render = sinon.spy();
                spotifyMock.getAccessToken = sinon.stub().yields(null, { access_token: 'abc' });
                spotifyMock.getUserInfo = sinon.stub().yields(null, { display_name: 'Ana' });
            });

            it('gera a playlist do usuário (primeira requisição para o Spotify)', function(done) {
                // Arrange
                spotifyMock.getUserTracks = sinon.stub().yields(null, {
                    items: [
                        { track: { name: 'A', artists: artists, album: album }},
                        { track: { name: 'A', artists: artists, album: album }},
                        { track: { name: 'N', artists: artists, album: album }}
                    ]
                });

                // Act
                sut.handleSpotifyResponse(reqMock, resMock);

                // Assert
                waitForCompletion(done, function() {
                    expect(resMock.render.calledWith('playlist.html', {
                        username: 'Ana',
                        tracksProcessedCount: 50,
                        tracks: [
                            { name: 'A', artist: artists[0].name, album: album.name },
                            { name: 'N', artist: artists[0].name, album: album.name },
                            { name: 'A', artist: artists[0].name, album: album.name },
                        ]
                    })).to.be(true);
                })
            });

            it('gera a playlist do usuário (múltiplas requisições para o Spotify)', function(done) {
                // Arrange
                spotifyMock.getUserTracks = sinon.stub();
                spotifyMock.getUserTracks
                    .onFirstCall().yields(null, {
                        items: [
                            { track: { name: 'A', artists: artists, album: album }},
                            { track: { name: 'N', artists: artists, album: album }}
                        ]
                    })
                    .onSecondCall().yields(null, {
                        items: [
                            { track: { name: 'A', artists: artists, album: album }}
                        ]
                    });

                // Act
                sut.handleSpotifyResponse(reqMock, resMock);

                // Assert
                waitForCompletion(done, function() {
                    expect(resMock.render.calledWith('playlist.html', {
                        username: 'Ana',
                        tracksProcessedCount: 100,
                        tracks: [
                            { name: 'A', artist: artists[0].name, album: album.name },
                            { name: 'N', artist: artists[0].name, album: album.name },
                            { name: 'A', artist: artists[0].name, album: album.name },
                        ]
                    })).to.be(true);
                })
            });

            it('gera a playlist do usuário (músicas insuficientes)', function(done) {
                // Arrange
                spotifyMock.getUserTracks = sinon.stub();
                spotifyMock.getUserTracks
                    .onFirstCall().yields(null, {
                        items: [
                            { track: { name: 'A', artists: artists, album: album }},
                            { track: { name: 'N', artists: artists, album: album }}
                        ]
                    })
                    .onSecondCall().yields(null, {
                        items: []
                    });

                // Act
                sut.handleSpotifyResponse(reqMock, resMock);

                // Assert
                waitForCompletion(done, function() {
                    expect(resMock.render.calledWith('playlist.html', {
                        username: 'Ana',
                        tracksProcessedCount: 50,
                        tracks: [
                            { name: 'A', artist: artists[0].name, album: album.name },
                            { name: 'N', artist: artists[0].name, album: album.name },
                            { name: 'Null and Void', artist: 'Detroit' },
                        ]
                    })).to.be(true);
                })
            });
        });

        describe('casos de erro', function() {
            var sendSpy;

            beforeEach(function() {
                sendSpy = sinon.spy();
                resMock.status = sinon.stub().withArgs(500).returns({ send: sendSpy });
            });

            it('retorna um erro caso o login no Spotify não seja realizado com sucesso', function() {
                // Arrange
                var sendSpy = sinon.spy();
                reqMock.query.error = 'access_denied';
                resMock.status = sinon.stub().withArgs(500).returns({ send: sendSpy });

                // Act
                sut.handleSpotifyResponse(reqMock, resMock);

                // Assert
                expect(sendSpy.calledWith('Ocorreu um erro ao realizar o login com o Spotify: access_denied')).to.be(true);
            });

            it('retorna um erro caso a obtenção do token de acesso não seja realizada com sucesso', function(done) {
                // Arrange
                spotifyMock.getAccessToken = sinon.stub().yields('error');

                // Act
                sut.handleSpotifyResponse(reqMock, resMock);

                // Assert
                waitForCompletion(done, function() {
                    expect(sendSpy.calledWith('Ocorreu um erro ao tentar obter o token de acesso')).to.be(true);
                });
            });

            it('retorna um erro caso a obtenção das informações do usuário não seja realizada com sucesso', function(done) {
                // Arrange
                spotifyMock.getAccessToken = sinon.stub().yields(null, { access_token: 'abc' });
                spotifyMock.getUserInfo = sinon.stub().yields('error');

                // Act
                sut.handleSpotifyResponse(reqMock, resMock);

                // Assert
                waitForCompletion(done, function() {
                    expect(sendSpy.calledWith('Ocorreu um erro ao tentar obter os dados do usuário')).to.be(true);
                });
            });

            it('retorna um erro caso a obtenção das músicas do usuário não seja realizada com sucesso', function(done) {
                // Arrange
                spotifyMock.getAccessToken = sinon.stub().yields(null, { access_token: 'abc' });
                spotifyMock.getUserInfo = sinon.stub().yields(null, { display_name: 'Fulano' });
                spotifyMock.getUserTracks = sinon.stub().yields('error');

                // Act
                sut.handleSpotifyResponse(reqMock, resMock);

                // Assert
                waitForCompletion(done, function() {
                    expect(sendSpy.calledWith('Ocorreu um erro ao tentar obter as músicas do usuário')).to.be(true);
                });
            });
        });

    });
});
