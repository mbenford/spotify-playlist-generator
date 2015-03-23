var expect = require('expect.js'),
    _ = require('lodash'),
    playlistGenerator = require('../src/playlist-generator');

describe('playlist', function() {
    var defaultTrack = { name: 'Null and Void', artist: 'Detroit', album: 'Horizon' },
        artists = [ { name: 'Artista' }],
        album = { name: 'Album' },
        tracks = [
            { track: { name: 'Z', artists: artists, album: album } },
            { track: { name: 'a', artists: artists, album: album } },
            { track: { name: 'A', artists: artists, album: album } },
            { track: { name: 'e', artists: artists, album: album } },
            { track: { name: 'f', artists: artists, album: album } },
            { track: { name: 'g', artists: artists, album: album } },
            { track: { name: 'q', artists: artists, album: album } },
            { track: { name: 'p', artists: artists, album: album } },
            { track: { name: 'l', artists: artists, album: album } },
            { track: { name: 'u', artists: artists, album: album } },
            { track: { name: 'x', artists: artists, album: album } }
        ];

    it('inicializa a playlist com a música padrão para cada letra do nome do usuário, ignorando os espaços', function() {
        // Arrange/Act
        var username = 'Fulano de Tal',
            sut = playlistGenerator(username);

        // Assert
        var expected = new Array(username.replace(/\s/g, '').length); _.fill(expected, defaultTrack);
        expect(sut.getTracks()).to.eql(expected);
    });

    describe('addTracks', function() {
        it('atribui uma música para cada letra do nome do usuário, sem repetição', function() {
            // Arrange
            var sut = playlistGenerator('Ana Paula');

            // Act
            sut.addTracks(tracks);

            // Assert
            expect(sut.getTracks()).to.eql([
                { name: 'a', artist: artists[0].name, album: album.name },
                defaultTrack,
                { name: 'A', artist: artists[0].name, album: album.name },
                { name: 'p', artist: artists[0].name, album: album.name },
                defaultTrack,
                { name: 'u', artist: artists[0].name, album: album.name },
                { name: 'l', artist: artists[0].name, album: album.name },
                defaultTrack,
            ]);
        });
    });

    describe('isComplete', function() {
        it('retorna false quando a playlist não estiver completa', function() {
            var sut = playlistGenerator('Ana Paula');

            // Act
            sut.addTracks(tracks);

            // Assert
            expect(sut.isComplete()).to.be(false);
        });

        it('retorna false quando a playlist não estiver completa', function() {
            var sut = playlistGenerator('Ana Paula');

            // Act
            sut.addTracks(tracks);
            sut.addTracks([
                { track: { name: 'N', artists: artists, album: album } },
                { track: { name: 'a', artists: artists, album: album } },
                { track: { name: 'A', artists: artists, album: album } },
            ]);

            // Assert
            expect(sut.isComplete()).to.be(true);
        });
    });
;
});
