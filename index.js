var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var pg = require('pg');

// Nodejs encryption with CTR
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

var uuid = require('uuid');

function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

//Note that in version 4 of express, express.bodyParser() was
//deprecated in favor of a separate 'body-parser' module.
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('pages/index', {rqt_user_id: ""});
});

app.get('/register', function(req, res) {
  res.render('pages/register', {errorMsg: ""} );
});

app.get('/account', function(req, res) {
  var user_id = req.query.user_id;
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM responses WHERE user_id=\'' + user_id + '\';', function(err, result) {
      done();
      if (err)
       { console.error(err); res.send("Error " + err); }
      else { 
      	var qids = []
      	for (var i = 0; i < result.rows.length; i++) {
      		qids.push(result.rows[i].question_id);
      	};
      	client.query('SELECT * FROM users WHERE id=\'' + user_id + '\';', function(err1, result1) {
	      done();
	      if (err)
	       { console.error(err1); res.send("Error " + err1); }
	      else {
	       	res.render('pages/account', {questions: result.rows, qids: qids, user: result1.rows[0]} ); 
	       }
	    });
      }
    });
    // res.render('pages/account', {user_id: user_id});
  });
});

app.get('/db', function (req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM user', function(err, result) {
      done();
      if (err)
       { console.error(err); res.send("Error " + err); }
      else
       { res.render('pages/db', {results: result.rows} ); }
    });
  });
})

app.post('/submitResponse', function(req, res) {
  response = req.body.response.replace("\r", "").replace("\n", "");
  question_id = req.body.question_id;
  user_id = req.body.user_id;
  if (user_id.length <= 5) {
  	res.render('pages/please_register', {errorMsg: "", question_id: question_id, response: response} );
  }
  else {
	  // res.send('You sent the response "' + question_id + '".');
	  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	  	client.query('INSERT INTO responses VALUES (\'' + user_id + '\', '+question_id+', \'' + response + '\');', function(err1, result1) {
	        done();
	        if (err) { 
	          res.send("This should not happen (T1): " + err);
	        }
	        else { 
	          res.redirect("/");
	        }
	      });
	  });
	}
});

app.post('/signIn', function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  var encryptedPassword = encrypt(password)
  // res.send('You signed up with email: "' + email + '" and password "' + password + '" encrypted as "' + encryptedPassword + '".');
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
  	client.query('SELECT exists (SELECT FROM users WHERE email=\'' + email + '\' LIMIT 1);', function(err, result) {
      done();
      if (err) { 
        res.send("This should not happen (T1):" + secretKey);
      }
      else { 
        if (!result.rows[0].exists) {
          // Create user
          // Generate a v4 (random) id 
  		  var user_id = uuid.v4(); // -> '110ec58a-a0f2-4ac4-8393-c866d813b8d1'
          client.query('INSERT INTO users VALUES (\'' + user_id + '\', \''+email+'\', \'' + encryptedPassword + '\')', function(err1, result1) {
	        done();
	        if (err) { 
	          res.send("This should not happen (T1): " + user_id + " " + email + " " + encryptedPassword);
	        }
	        else { 
	          res.render('pages/index', {rqt_user_id: user_id});
	          // localStorage.setItem('rqt_user_id', user_id);
	          // res.redirect("/");
	        }
	      });
        }
        else {
        	// Validate/Sign In User
          client.query('SELECT * FROM users WHERE email=\'' + email + '\';', function(err1, result1) {
	        done();
	        if (err) { 
	          res.send("This should not happen (T1): " + user_id + " " + email + " " + encryptedPassword);
	        }
	        else { 
	        	// res.send("Tester" + result1.rows[0].encrypted_password);
	        	// Validating User
	        	if (encryptedPassword === result1.rows[0].encrypted_password) {
	        		// If validated, sign in
	        		// TO DO: Assign LocalStorage to uuid
	        		// localStorage.setItem('rqt_user_id', result1.rows[0].id);
	        		// res.redirect("/");
	        		res.render('pages/index', {rqt_user_id: result1.rows[0].id});
	        	}
	        	else{
	        		// If not, return with error
	        		res.render('pages/register', {errorMsg: "The password you entered did not match the one in our database. Please try again."} );
	        	}
	        }
	      });
        } 
      }
    });
  });
});

app.post('/please_register', function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  var encryptedPassword = encrypt(password)
  var question_id = req.body.question_id;
  var response = req.body.response.replace("\r", "").replace("\n", "");
  // res.send('You signed up with email: "' + email + '" and password "' + password + '" encrypted as "' + encryptedPassword + '".');
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
  	client.query('SELECT exists (SELECT FROM users WHERE email=\'' + email + '\' LIMIT 1);', function(err, result) {
      done();
      if (err) { 
        res.send("This should not happen (T1):" + secretKey);
      }
      else { 
        if (!result.rows[0].exists) {
          // Create user
          // Generate a v4 (random) id 
  		  var user_id = uuid.v4(); // -> '110ec58a-a0f2-4ac4-8393-c866d813b8d1'
          client.query('INSERT INTO users VALUES (\'' + user_id + '\', \''+email+'\', \'' + encryptedPassword + '\')', function(err1, result1) {
	        done();
	        if (err) { 
	          res.send("This should not happen (T1): " + user_id + " " + email + " " + encryptedPassword);
	        }
	        else { 
	        	client.query('INSERT INTO responses VALUES (\'' + user_id + '\', '+question_id+', \'' + response + '\');', function(err2, result2) {
			        done();
			        if (err) { 
			          res.send("This should not happen (T1): " + user_id + " " + email + " " + encryptedPassword);
			        }
			        else { 
			          res.render('pages/index', {rqt_user_id: user_id});
			          // res.redirect("/");
			        }
		        });
	        }
	      });
        }
        else {
        	// Validate/Sign In User
          client.query('SELECT * FROM users WHERE email=\'' + email + '\';', function(err1, result1) {
	        done();
	        if (err) { 
	          res.send("This should not happen (T1): " + user_id + " " + email + " " + encryptedPassword);
	        }
	        else { 
	        	// Validating User
	        	if (encryptedPassword === result1.rows[0].encrypted_password) {
	        		// If validated, sign in
	        		var user_id = result1.rows[0].id;
	        		client.query('INSERT INTO responses VALUES (\'' + user_id + '\', '+question_id+', \'' + response + '\');', function(err2, result2) {
				        done();
				        if (err) { 
				          res.send("This should not happen (T1): " + user_id);
				        }
				        else { 
				          res.render('pages/index', {rqt_user_id: user_id});
				        }
			        });
	        	}
	        	else{
	        		// If not, return with error
	        		res.render('pages/register', {errorMsg: "The password you entered did not match the one in our database. Please try again."} );
	        	}
	        }
	      });
        } 
      }
    });
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

//The 404 Route
app.get('*', function(req, res){
  res.render('pages/404');
  // res.send('what???', 404);
});
