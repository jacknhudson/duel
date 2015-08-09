function validateEmail () {
  var enteredEmail = document.getElementById("email").value
  if (enteredEmail.length >= 1) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    if (re.test(enteredEmail)) {
      document.getElementById("email").style.color = '#ecf0f1';
    }
    else {
      document.getElementById("email").style.color = '#2c3e50';
    }
  }
}

function validatePassword (argument) {
  var enteredPassword = document.getElementById("password").value
  if (enteredPassword.length >= 5) {
    document.getElementById("password").style.color = '#ecf0f1';
  }
  else {
    document.getElementById("password").style.color = '#2c3e50';
  }
}

function shake(e, oncomplete, distance, time) {
    // Handle arguments
    if (typeof e === "string") e = document.getElementById(e);
    if (!time) time = 300;
    if (!distance) distance = 5;

    // Save the original style of e, Make e relatively positioned, Note the animation start time, Start the animation
    var originalStyle = e.style.cssText;
    e.style.position = "relative";
    var start = (new Date()).getTime();
    animate();

    // This function checks the elapsed time and updates the position of e.
    // If the animation is complete, it restores e to its original state.
    // Otherwise, it updates e's position and schedules itself to run again.
    function animate() {
        var now = (new Date()).getTime();
        // Get current time
        var elapsed = now-start;
        // How long since we started
        var fraction = elapsed/time;
        // What fraction of total time?
        if (fraction < 1) {
            // If the animation is not yet complete
            // Compute the x position of e as a function of animation
            // completion fraction. We use a sinusoidal function, and multiply
            // the completion fraction by 4pi, so that it shakes back and
            // forth twice.
            var x = distance * Math.sin(fraction*4*Math.PI);
            e.style.left = x + "px";
            // Try to run again in 25ms or at the end of the total time.
            // We're aiming for a smooth 40 frames/second animation.
            setTimeout(animate, Math.min(25, time-elapsed));
        }
        else {
            // Otherwise, the animation is complete
            e.style.cssText = originalStyle // Restore the original style
            if (oncomplete) oncomplete(e);
            // Invoke completion callback
        }
    }
}

// function keyhandler (argument) {
//   var responseLength = document.getElementById("response").value.length
//   if (event.which == 13) {submission();}
//   if (responseLength == 0) {
//     document.getElementById("directions").innerHTML = "Press Enter to skip"
//   }
//   else {
//     document.getElementById("directions").innerHTML = "Press Enter to submit"
//   }
//   document.getElementById("charCount").innerHTML = responseLength;
// }
// function submission () {
//   event.preventDefault();
//   if (document.getElementById("response").value.length <= 1) {
//     document.location = "/";
//   }
//   else {
//     $("form").submit();
//   }
// }
// function skip () {
//   event.preventDefault();
//   document.location = "/";
// }