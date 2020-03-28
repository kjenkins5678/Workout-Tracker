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
            <a href="#" class="btn btn-primary mt-2">Log</a>
            <a href="/workout?workout_id=${workout._id}" class="btn btn-primary mt-2">Edit</a>
          </div>
        </div>
      `;
      workoutContainer.appendChild(div);
    });
  });