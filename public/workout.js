$(document).ready(function() {

  var url = window.location.search;
  var nameInput = $("#nameInput");
  var durInput = $("#durationInput");
  var caloriesInput = $("#caloriesInput");
  var form = $("#exercises");

  if (url.indexOf("?workout_id=") !== -1) {
    workoutId = url.split("=")[1];
  }

  function GetUserData() {
    return userObject = {
      name : nameInput.val(),
      duration : durInput.val(),
      calories : caloriesInput.val()
    };
  };

  // Get exercises from api and display them on the page

  fetch(`/api/workouts/${workoutId}`)
    .then(response => {
      return response.json();
    })
    .then(data => {

      //Select workout-name id
      const workoutHeading = document.querySelector("#workout-name");
      //Add the workout name from the db as the title of the page
      workoutHeading.innerHTML = data.name;

      const exercisesSpot = document.querySelector("#exercises");

      //For each exercise...
      data.exercises.forEach(exercise => {
        console.log(exercise.name, exercise.duration, exercise.calories);

        const div = document.createElement("div");
        div.classList.add("form-row");

        div.innerHTML = `
          <div class="col-7">
            <input type="text" class="form-control" placeholder="${exercise.name}" id="exercise-name">
          </div>
          <div class="col">
            <input type="text" class="form-control" placeholder="${exercise.duration}" id="exercise-duration">
          </div>
          <div class="col">
            <input type="text" class="form-control" placeholder="${exercise.calories}" id="exercise-calories">
         </div>
          <div class="col-auto">
            <button type="delete" class="btn btn-danger mb-2">Remove</button>
           </div>
        `;
        exercisesSpot.prepend(div);

      });
    });

  form.submit((e) => {
    e.preventDefault();
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(
      {"name" : nameInput.val(),
        "duration" : durInput.val(),
        "calories" : caloriesInput.val()
      });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch(`/api/new/exercise/${workoutId}`, requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log(result)
      })
      .catch(error => console.log("error", error));
  });

});