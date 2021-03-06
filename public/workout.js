$(document).ready(function() {

  var url = window.location.search;

  if (url.indexOf("?workout_id=") !== -1) {
    workoutId = url.split("=")[1];
  }

  // Get exercises from api and display them on the page

  function drawPage() {

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

          const div = document.createElement("div");
          div.classList.add("form-row", "oldItem");

          //html template for the values in the database
          div.innerHTML = `
            <div class="col-7">
              <input type="text" class="form-control" value="${exercise.name}" id="exercise-name-${exercise._id}">
            </div>
            <div class="col">
              <input type="text" class="form-control" value="${exercise.duration}" id="exercise-duration-${exercise._id}">
            </div>
            <div class="col">
              <input type="text" class="form-control" value="${exercise.calories}" id="exercise-calories-${exercise._id}">
          </div>
            <div class="col-auto">
              <button type="delete" class="btn btn-danger mb-2" id="${exercise._id}">Remove</button>
            </div>
          `;
          exercisesSpot.append(div);
        });
        const formDiv = document.createElement("div");
        formDiv.classList.add("form-row", "newItem");

        //html template for the input form fields
        formDiv.innerHTML = `
        <div class="col-7">
              <input type="text" class="form-control" placeholder="Name" id="exercise-name">
            </div>
            <div class="col">
              <input type="text" class="form-control" placeholder="Duration" id="exercise-duration">
            </div>
            <div class="col">
              <input type="text" class="form-control" placeholder="Calories" id="exercise-calories">
          </div>
            <div class="col-auto">
              <button type="submit" class="btn btn-primary mb-2" id="add">Add</button>
            </div>
        `;
        exercisesSpot.append(formDiv);
      });
  }

  drawPage();

  //Click Events

  $(document).on("click", ".btn-primary", (e) => {
    e.preventDefault();

    var nameInput = $("#exercise-name");
    var durInput = $("#exercise-duration");
    var caloriesInput = $("#exercise-calories");

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
      .then(() => {
        $("#exercises").empty();
        drawPage();
      })
      .catch(error => console.log("error", error));
  });

  $(document).on("click", ".btn-danger", (e) => {
    e.preventDefault();
    console.log(e);
    console.log(e.target.id);

    var requestOptions = {
      method: "DELETE",
      redirect: "follow"
    };

    fetch(`http://localhost:3000/api/exercises/${e.target.id}`, requestOptions)
      .then(response => response.text())
      .then(() => {
        //some code here to redraw the page
        $("#exercises").empty();
        drawPage();
      })
      .catch(error => console.log("error", error));

  });

});