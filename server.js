var express = require('express'),
    app = express(),
    router = express.Router();

app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.listen(8899, 'localhost');
console.log('Listening on localhost:8899');