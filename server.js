var config = require('./src/config');

if (config.missingRequiredConfig()) {
    console.log('Missing required configuration. Please be sure all required environment variables are set.');
    process.exit(1);
}

var express = require('express'),
    app = express(),
    router = express.Router(),
    controller = require('./src/controller');

app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use('/static', express.static(__dirname + '/static'));
app.use('/', router);

router.get('/', function(req, res) {
   res.render('index.html');
});
router.get('/login-spotify', controller.loginOnSpotify);
router.get('/handle-spotify-response', controller.handleSpotifyResponse);

app.listen(8899, 'localhost');
console.log('Listening on localhost:8899');