$(document).ready(function(){
  $( "#all" ).fadeIn( "fast", function() {
  // Animation complete
  });
});

function keyhandler (argument) {
  var charLimit = 250;
  var feedbackLength = document.getElementById("feedback").value.length;
  // If over charLimit
  if (feedbackLength > charLimit) {
    document.getElementById("errorMsg").innerHTML = "Uh oh! Your feedback is over the 250 character limit.";
    document.getElementById("directions").innerHTML = "";
  }
  else {
    document.getElementById("errorMsg").innerHTML = "";
    // If enter pressed
    if (event.which == 13) {
      event.preventDefault();
      if (feedbackLength <= 1) {
        document.location = "/";
      }
      else {
        // Submit feedback
        submission();
      }
    }
    else {
      // If enter is NOT pressed
      if (feedbackLength == 0 ) {
        document.getElementById("directions").innerHTML = "Press Enter to return to questions";
      }
      else {
        document.getElementById("directions").innerHTML = "Press Enter to submit";
      }
    }
  }
  document.getElementById("charCount").innerHTML = feedbackLength;
}

function submission () {
  // event.preventDefault();
  var ls = localStorage.getItem('rqt_user_id');
	document.getElementById("user_id").setAttribute("value", ls);
  $( "#all" ).fadeOut( "fast", function() {
    // Animation complete
    $("form").submit();
  });
}