$(document).ready(function(){
  $.getScript('./questions.js', function()
  {
   var randomIndex = Math.floor(Math.random() * questions.length);
    var selectedQuestion = questions[randomIndex];
    document.getElementById("question").innerHTML = selectedQuestion;
    document.getElementById("question_id").setAttribute("value",randomIndex.toString());
  });
});

function keyhandler (argument) {
  var responseLength = document.getElementById("response").value.length
  if (event.which == 13) {submission();}
  if (responseLength == 0) {
    document.getElementById("directions").innerHTML = "Press Enter to skip"
  }
  else {
    document.getElementById("directions").innerHTML = "Press Enter to submit"
  }
  document.getElementById("charCount").innerHTML = responseLength;
}
function submission () {
  event.preventDefault();
  if (document.getElementById("response").value.length <= 1) {
    document.location = "/";
  }
  else {
  	var ls = localStorage.getItem('rqt_user_id');
  	document.getElementById("user_id").setAttribute("value", ls);
    $("form").submit();
  }
}
function skip () {
  event.preventDefault();
  document.location = "/";
}