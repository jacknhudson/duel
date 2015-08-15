$(document).ready(function(){
  $.getScript('./questions.js', function()
  {
   var randomIndex = Math.floor(Math.random() * questions.length);
    var selectedQuestion = questions[randomIndex];
    document.getElementById("question").innerHTML = selectedQuestion;
    document.getElementById("question_id").setAttribute("value",randomIndex.toString());
    $( "#all" ).fadeIn( "fast", function() {
    // Animation complete
  });
  });
});

function keyhandler (argument) {
  var charLimit = 140;
  var responseLength = document.getElementById("response").value.length;
  // If over charLimit
  if (responseLength > charLimit) {
    document.getElementById("errorMsg").innerHTML = "Uh oh! Your response is over the 140 character limit.";
    document.getElementById("directions").innerHTML = "";
  }
  else {
    document.getElementById("errorMsg").innerHTML = "";
    // If enter pressed
    if (event.which == 13) {
      event.preventDefault();
      if (responseLength <= 1) {
        $( "#all" ).fadeOut( "fast", function() {
          // Animation complete
          if (ls == null) {
            // User isn't signed in. Go to register page
            document.location = "/register";
          }
          else {
            // User is signed in. Go to new question
            document.location = "/";
          }
        });
      }
      else {
        // Submit feedback
        submission();
      }
    }
    else {
      // If enter is NOT pressed
      if (responseLength == 0 ) {
        document.getElementById("directions").innerHTML = "Press Enter to skip";
      }
      else {
        document.getElementById("directions").innerHTML = "Press Enter to submit";
      }
    }
  }
  document.getElementById("charCount").innerHTML = responseLength;
}

// function keyhandler (argument) {
//   var responseLength = document.getElementById("response").value.length
//   if (event.which == 13) {submission();}
//   else {
//     if (responseLength == 0 ) {
//       document.getElementById("directions").innerHTML = "Press Enter to skip"
//     }
//     else {
//       document.getElementById("directions").innerHTML = "Press Enter to submit"
//     }
//     document.getElementById("charCount").innerHTML = responseLength;
//   }
// }
function submission () {
  // event.preventDefault();
  var ls = localStorage.getItem('rqt_user_id');
  if (document.getElementById("response").value.length <= 1) {
    $( "#all" ).fadeOut( "fast", function() {
      // Animation complete
      if (ls == null) {
        // User isn't signed in. Go to register page
        document.location = "/register";
      }
      else {
        // User is signed in. Go to new question
        document.location = "/";
      }
    });
  }
  else {
  	// var ls = localStorage.getItem('rqt_user_id');
  	document.getElementById("user_id").setAttribute("value", ls);
    $( "#all" ).fadeOut( "fast", function() {
      // Animation complete
      $("form").submit();
    });
  }
}