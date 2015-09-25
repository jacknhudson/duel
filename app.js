// var http = require('http');
var express = require('express');
var routes = require('./routes');
var bodyParser = require('body-parser');
// var session = require('express-session')

var app = express();
// var port = process.env.PORT || 5000;
app.set('port', (process.env.PORT || 5000));


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Questions
app.get('/', routes.index);

// Handle 404
app.use(routes.fourOFour);
app.use(routes.fiveHundred);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});