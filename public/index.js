fetch("/api/workouts")
  .then(response => {
    return response.json();
  })
  .then(data => {

    const workoutContainer = document.querySelector(".workouts");
    data.forEach(workout => {
      const div = document.createElement("div");

      div.innerHTML = `
      <div class="col-lg-3 col-md-6 mb-4">
        <div class="card h-100">
          <img class="card-img-top" src="http://placehold.it/500x325" alt="">
          <div class="card-body">
            <h4 class="card-title">${workout.name}</h4>
            <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente esse necessitatibus neque.</p>
          </div>
          <div class="card-footer">
            <a href="#" class="btn btn-primary">Find Out More!</a>
          </div>
        </div>
      </div>
      `;
      workoutContainer.appendChild(div);
    });
  });