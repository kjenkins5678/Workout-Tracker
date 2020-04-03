$(document).ready(function() {

  function drawPage() {

    fetch("/api/workouts/")
      .then(response => {
        return response.json();
      })
      .then(data => {

        const workoutsSpot = document.querySelector("#workout-list");

        //For each workout...
        data.forEach(workout => {

          const listItem = document.createElement("li");
          listItem.innerHTML = `
          <li class='list-group-item'>${workout.name}</li>
          `;

          workoutsSpot.append(listItem);
        });
      });
  }

  drawPage();

  // When user clicks addBtn
  $(document).on("click", ".btn", (e) => {
    e.preventDefault();

    var newWorkout = $("#new-workout");

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({"name": newWorkout.val()});

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("/api/new/workouts", requestOptions)
      .then(response => response.text())
      .then((result) => {
        console.log(result);
        $("#workout-list").empty();
        drawPage();
      })
      .catch((error) => {
        console.log("error", error);
      });

  });

// end document ready
});
