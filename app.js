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

// var server = http.createServer(app);
// server.listen(port);

// console.log("http server listening on %d", port);

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Questions
app.get('/', routes.index);
app.post('/submitResponse', routes.submitResponse);

// Account
app.get('/register', routes.register);
app.get('/account', routes.account);
app.post('/signIn', routes.signIn);
app.post('/please_register', routes.please_register);

// feedback
app.get('/feedback', routes.feedback);
app.post('/submitFeedback', routes.submitFeedback);

// Handle 404
app.use(routes.fourOFour);
app.use(routes.fiveHundred);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});