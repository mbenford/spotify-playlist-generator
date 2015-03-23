var _ = require('lodash');

var defaultTrack = { name: 'Null and Void', artist: 'Detroit' };

module.exports = function(username) {
    var chars = username.replace(/\s/g, '').toLowerCase().split(''),
        selectedTracks = new Array(chars.length);

    _.fill(selectedTracks, defaultTrack);

    return {
        getTracks: function() { return selectedTracks; },
        addTracks: function(items) {
            items.forEach(function(item) {
                var firstChar = item.track.name[0],
                    index = chars.indexOf(firstChar.toLowerCase());

                if (index !== -1) {
                    selectedTracks[index] = {
                        name: item.track.name,
                        artist: item.track.artists[0].name,
                        album: item.track.album.name
                    };
                    chars[index] = null;
                }
            });
        },
        isComplete: function() {
            return !_.some(selectedTracks, defaultTrack);
        }
    };
}
