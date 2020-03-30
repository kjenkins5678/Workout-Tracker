const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/fitness_tracker", { useNewUrlParser: true });

// post api routes *************************************************************


// Add a workout
app.post("/api/new/workouts", ({ body }, res) => {
  db.Workout.create(body)
    .then(newWorkout => {
      res.json(newWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

app.post("/api/new/exercise/:_id", ({ body }, res) => {
  db.Exercise.create(body)
    .then(({ _id }) => db.Workout.findOneAndUpdate({"_id" : req.params._id}, { $push: { exercises: _id } }, { new: true }))
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});


// get api routes *************************************************************

// Get just exercises
app.get("/api/exercises", (req, res) => {
  db.Exercise.find({})
    .then(dbExercise => {
      res.json(dbExercise);
    })
    .catch(err => {
      res.json(err);
    });
});

// Get just workouts
app.get("/api/workouts", (req, res) => {
  db.Workout.find({})
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

//Get all workouts and populate the workouts with exercises
app.get("/populatedworkout", (req, res) => {
  db.Workout.find({})
    .populate("exercises")
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

//Get a workout by id and populate it with its exercises
app.get("/api/workouts/:_id", function(req, res){
  db.Workout.findOne({
    _id: req.params._id
  }).populate("exercises")
    .then(oneWorkout => {
      res.json(oneWorkout);
    }).catch(err => {
      res.status(400).json(err);
    });
});

//html routes *************************************************************

// If no matching route is found default to home
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get("/workout", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/workout.html"));
});

app.get("/workout/edit", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/newWorkout.html"));
});

//start server on port ******************************************************

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});

