fetch("/api/workouts")
  .then(response => {
    return response.json();
  })
  .then(data => {

    console.log(data.length);

    const workoutContainer = document.querySelector(".workouts");
    data.forEach(workout => {

      const div = document.createElement("div");
      div.classList.add("col");

      div.innerHTML = `
        <div class="card h-100">
          <div class="card-body">
            <h4 class="card-title">${workout.name}</h4>
            <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente esse necessitatibus neque.</p>
          </div>
          <div class="card-footer">
            <a href="#" class="btn btn-primary">Log</a>
            <a href="/workout?workout_id=${workout._id}" class="btn btn-primary">Edit</a>
          </div>
        </div>
      `;
      workoutContainer.appendChild(div);
    });
  });