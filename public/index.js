fetch("/api/workouts")
  .then(response => {
    return response.json();
  })
  .then(data => {

    const workoutContainer = document.querySelector(".workouts");
    data.forEach(workout => {
      console.log(workout.name);
      const div = document.createElement("div");
      div.innerHTML = `
        <h2>${workout.name}<h2>
      `;
    workoutContainer.appendChild(div);
    });
  });