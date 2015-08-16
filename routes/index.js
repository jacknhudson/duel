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

// Routes
exports.index = function (req, res) {
	res.render('pages/index', {rqt_user_id: ""});
};

exports.register = function (req, res) {
	res.render('pages/register', {errorMsg: ""} );
};

exports.feedback = function (req, res) {
	res.render('pages/feedback', {errorMsg: ""} );
};

exports.account = function (req, res) {
  var user_id = req.query.user_id;
  if (user_id == null) {
  	res.render('pages/404');
  }
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
  });
};

exports.submitResponse = function (req, res) {
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
};

exports.submitFeedback = function (req, res) {
  feedback = req.body.feedback.replace("\r", "").replace("\n", "");
  user_id = req.body.user_id;
  if (user_id.length <= 5) {
  	res.render('pages/404');
  }
  else {
	  // res.send('You sent the feedback "' + user_id + '".');
	  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	  	client.query('INSERT INTO feedback VALUES (\'' + user_id + '\', \'' + feedback + '\');', function(err1, result1) {
	        done();
	        if (err) { 
	          res.send("This should not happen (T1): " + err);
	        }
	        else { 
	          res.render('pages/feedback', {errorMsg: "Thanks for the feedback!"} );
	        }
	      });
	  });
	}
};

exports.signIn = function (req, res) {
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
};

exports.please_register = function (req, res) {
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
};

exports.feedback = function (req, res) {
	res.render('pages/feedback', {errorMsg: ""} );
};

exports.fourOFour = function(req, res) {
  res.status(400);
  res.render('pages/404');
  // res.render('pages/404', {message: "We couldn't find what you were looking for."});
};

exports.fiveHundred = function(error, req, res, next) {
  res.status(500);
  res.render('pages/404');
  // res.render('pages/404', {message: "We encountered the following error: " + error});
};