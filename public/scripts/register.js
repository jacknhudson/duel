function isEmail (email) {
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return re.test(email);
}

function isPassword (password) {
  return password.length >= 5;
}

function validateEmail (arg) {
  if (event.which == 13) {
    validateBoth(arg);
  }
  else {
    var enteredEmail = document.getElementById("email").value
    if (enteredEmail.length >= 1) {
      if (isEmail(enteredEmail)) {
        document.getElementById("email").style.color = '#ecf0f1';
      }
      else {
        document.getElementById("email").style.color = '#2c3e50';
      }
    }
  }
}

function validateBoth (arg) {
  var enteredEmail = document.getElementById("email").value
  var enteredPassword = document.getElementById("password").value
  var goodEmail = isEmail(enteredEmail);
  var goodPass = isPassword(enteredPassword);
  if (goodEmail && goodPass) {
    $("form").submit();
  }
  else {
    if (!goodEmail) shake("email");
    if (!goodPass) shake("password");
  }
}

function validatePassword (arg) {
  if (event.which == 13) {
    validateBoth(arg);
  }
  else {
    var enteredPassword = document.getElementById("password").value
    if (isPassword(enteredPassword)) {
      document.getElementById("password").style.color = '#ecf0f1';
    }
    else {
      document.getElementById("password").style.color = '#2c3e50';
    }
  }
}

function shake (str, oncomplete, distance, time) {
    // Handle arguments
    var e = document.getElementById(str);
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