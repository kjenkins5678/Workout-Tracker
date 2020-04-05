$(document).ready(function() {

  fetch("/api/workouts")
    .then(response => {
      return response.json();
    })
    .then(data => {

      const workoutContainer = document.querySelector(".workouts");
      data.forEach(workout => {

        const div = document.createElement("div");
        div.classList.add("col");

        div.innerHTML = `
        <div class="card h-100">
          <div class="card-body">
            <h4 class="card-title">${workout.name}</h4>
          </div>
          <div class="card-footer text-center">
            <a href="/log" class="btn btn-primary log mt-2" data-id=${workout._id}>Log</a>
            <a href="/workout?workout_id=${workout._id}" class="btn btn-primary mt-2">Edit</a>
          </div>
        </div>
      `;
        workoutContainer.appendChild(div);
      });
    });

  $(document).on("click", ".log", (e) => {
    e.preventDefault();

    var workoutId = e.target.getAttribute("data-id");

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");


    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow"
    };

    fetch(`/api/new/log/${workoutId}`, requestOptions)
      .then( () => {
        alert("Workout Logged");
      })
      // .then(() => {
      //   // response.redirect("/log");
      // })
      .catch(error => console.log("error", error));
  });
});
