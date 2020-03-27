$(document).ready(function() {
  var exerciseForm = $("#exercises");
  var exerciseName = $("#exercise-name");
  var exerciseDuration = $("#exercise-duration");
  var exerciseCalories = $("#exercise-calories");


  $(exerciseForm).on("add", handleFormSubmit);

  var url = window.location.search;

  if (url.indexOf("?workout_id=") !== -1) {
    postId = url.split("=")[1];
    getPostData(postId);
  }


  function handleFormSubmit(event) {
    event.preventDefault();
    // Wont submit the post if we are missing a name, duration, or calories
    if (!exerciseName.val().trim() || !exerciseDuration.val() || !exerciseCalories.val()) {
      return;
    }
    // Constructing a newPost object to hand to the database
    var newPost = {
      name: exerciseName
        .val()
        .trim(),
      duration: exerciseDuration
        .val(),
      calories: exerciseCalories.val()
    };
  }

  // Submits a new post and brings user to blog page upon completion
  function submitPost() {
    console.log("submit post working")
    $.post("/api/exercises", function() {
    });
  }

  // Gets post data for the current post if we're editing, or if we're adding to an author's existing posts
  function getPostData(id) {
    var queryUrl = "/api/workouts/" + id;
    console.log(queryUrl);
    $.get(queryUrl, function(data) {
      if (data) {
        console.log(data);
      }
    });
  }

  // Update a given post, bring user to the blog page when done
  function updatePost(post) {
    $.ajax({
      method: "PUT",
      url: "/api/posts",
      data: post
    })
      .then(function() {
        console.log("posted update");
      });
  }

  $("#exercises").on("submit", function(event) {
    event.preventDefault();
    console.log("button connected");
    submitPost();
  });
});