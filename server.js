var express = require('express'),
    app = express(),
    router = express.Router(),
    config = require('./src/config');

if (config.missingRequiredConfig()) {
    console.log('Missing required configuration. Please be sure all required environment variables are set.');
    process.exit(1);
}

app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use('/static', express.static(__dirname + '/static'));
app.use('/', router);

router.get('/', function(req, res) {
   res.render('index.html');
});

app.listen(8899, 'localhost');
console.log('Listening on localhost:8899');