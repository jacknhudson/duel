var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var pg = require('pg');

//Note that in version 4 of express, express.bodyParser() was
//deprecated in favor of a separate 'body-parser' module.
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/register', function(request, response) {
  response.render('pages/register');
});

app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM responses', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/db', {results: result.rows} ); }
    });
  });
})

app.post('/submitResponse', function(req, res) {
  response = req.body.response;
  question_id = req.body.question_id;
  // res.send('You sent the response "' + req.body.question_id + '".');
  response = req.body.response
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
  	client.query('INSERT INTO responses VALUES (0, '+question_id+', \'' + response + '\')', function(err1, result1) {
        done();
        if (err) { 
          response.send("This should not happen (T1): " + response);
        }
        else { 
          res.redirect("/");
        }
      });
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
