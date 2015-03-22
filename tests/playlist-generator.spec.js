var expect = require('expect.js'),
    _ = require('lodash'),
    playlistGenerator = require('../src/playlist-generator');

describe('playlist', function() {
    var defaultTrack = { name: 'Null and Void', artist: 'Detroit'},
        artists = [ { name: 'Artista' }],
        tracks = [
            { track: { name: 'Z', artists: artists } },
            { track: { name: 'a', artists: artists } },
            { track: { name: 'A', artists: artists } },
            { track: { name: 'e', artists: artists } },
            { track: { name: 'f', artists: artists } },
            { track: { name: 'g', artists: artists } },
            { track: { name: 'q', artists: artists } },
            { track: { name: 'p', artists: artists } },
            { track: { name: 'l', artists: artists } },
            { track: { name: 'u', artists: artists } },
            { track: { name: 'x', artists: artists } },
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
                { name: 'a', artist: artists[0].name },
                defaultTrack,
                { name: 'A', artist: artists[0].name },
                { name: 'p', artist: artists[0].name },
                defaultTrack,
                { name: 'u', artist: artists[0].name },
                { name: 'l', artist: artists[0].name },
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
                { track: { name: 'N', artists: artists } },
                { track: { name: 'a', artists: artists } },
                { track: { name: 'A', artists: artists } },
            ]);

            // Assert
            expect(sut.isComplete()).to.be(true);
        });
    });
;
});
