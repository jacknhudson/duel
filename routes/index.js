// Routes
exports.index = function (req, res) {
	res.render('pages/index', {rqt_user_id: ""});
};

exports.fourOFour = function(req, res) {
  res.status(400);
  res.redirect("/");
  // res.render('pages/404', {message: "We couldn't find what you were looking for."});
};

exports.fiveHundred = function(error, req, res, next) {
  res.status(500);
  res.redirect("/");
  // res.render('pages/404', {message: "We encountered the following error: " + error});
};