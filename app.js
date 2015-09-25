// var http = require('http');
var express = require('express');
var routes = require('./routes');
var bodyParser = require('body-parser');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
// var session = require('express-session')

var app = express();
// var port = process.env.PORT || 5000;
app.set('port', (process.env.PORT || 5000));


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new Strategy(
  function(username, password, cb) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT exists (SELECT FROM product_users WHERE username=\'' + username + '\' LIMIT 1);', function(err, result) {
      done();
      if (err) { 
        return cb(err);
      }
      else { 
        if (!result.rows[0].exists) {
          return cb(null, false);
        }
        else {
        	client.query('SELECT * FROM product_users WHERE username=\'' + username + '\' LIMIT 1;', function(err1, result1) {
            done();
            if (err1) { 
              return cb(err1);
            }
            else { 
            	var user = result1.rows[0];
            	// throw (user.username);
	        	// Check password
	        	var encryptedPassword = encrypt(password);
	        	if (encryptedPassword == user.password) {
	        		// throw ("TestA");
	        		return cb(null, user);
	        	}
	        	else {
	        		// throw (user.password);
	        		return cb(null, false);
	        	}
            }
          });
        } 
      }
    });
  });
}));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT exists (SELECT FROM product_users WHERE id=\'' + id + '\' LIMIT 1);', function(err, result) {
      done();
      if (err) { 
        return cb(err);
      }
      else { 
        if (!result.rows[0].exists) {
          return cb(null, false);
        }
        else {
        	client.query('SELECT * FROM product_users WHERE id=\'' + id + '\' LIMIT 1;', function(err1, result1) {
	            done();
	            if (err1) { 
	              return cb(err1);
	            }
	            else { 
	            	var user = result1.rows[0];
		        	return cb(null, user);
	        	}
          	});
        } 
      }
    });
  });
});

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());


// var server = http.createServer(app);
// server.listen(port);

// console.log("http server listening on %d", port);

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