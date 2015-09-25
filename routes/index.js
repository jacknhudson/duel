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