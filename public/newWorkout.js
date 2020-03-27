// When user chirps (clicks addBtn)
$("#add-workout").on("click", function(event) {
  event.preventDefault();

  // Make a newChirp object
  var newWorkout = {
    name: $("#new-workout").val().trim(),
  };

  // Send an AJAX POST-request with jQuery
//   $.post("/api/new/workouts", newWorkout)
//   })

  $.post( "/api/new/workouts", function() {
      console.log(newWorkout);
    // $( ".result" ).html( newWorkout );
  });

  // Empty each input box by replacing the value with an empty string
//   $("#new-workout").val("");
});