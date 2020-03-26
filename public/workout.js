$(document).ready(function() {
  var exerciseForm = $("#exercises");
  var exerciseName = $("#exercise-name");
  var exerciseDuration = $("#exercise-duration");
  var exerciseCalories = $("#exercise-calories");


  $(exerciseForm).on("add", handleFormSubmit);

  var url = window.location.search;

  var updating = false;

  console.log("testing")

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

    // If we're updating a post run updatePost to update a post
    // Otherwise run submitPost to create a whole new post
    if (updating) {
      newPost.id = postId;
      updatePost(newPost);
    }
    else {
      submitPost(newPost);
    }
  }

  // Submits a new post and brings user to blog page upon completion
  function submitPost(post) {
    $.post("/api/posts", post, function() {
      window.location.href = "/blog";
    });
  }

  // Gets post data for the current post if we're editing, or if we're adding to an author's existing posts
  function getPostData(id) {
    var queryUrl = "/api/workouts/" + id;
    $.get(queryUrl, function(data) {
      if (data) {
        console.log(data.name);
        // If this post exists, prefill our cms forms with its data

        // If we have a post with this id, set a flag for us to know to update the post
        // when we hit submit
        updating = true;
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
});