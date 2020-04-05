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

// Add new exercises
app.post("/api/new/exercise/:_id", (req, res) => {
  db.Exercise.create(req.body)
    .then(newExerciseObject => db.Workout.findOneAndUpdate({"_id" : req.params._id}, { $push: { exercises: newExerciseObject._id } }, { new: true }))
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

// Populate workout log
app.post("/api/new/log/:_id", function(req, res){
  db.Workout.aggregate([
    {$match: {"_id": mongoose.Types.ObjectId(req.params._id)}},
    {$lookup: {from: "exercises", localField: "exercises", foreignField: "_id", as: "exercise"}},
    {$unwind: "$exercise"},
    {$project: {_id: 0, name: 1, calories: "$exercise.calories"}},
    {$group: {_id : "$name", totalCalories: {$sum: "$calories"}}}
  ])
    .then(aggResult => db.Log.create({
      name: aggResult[0]._id,
      calories: aggResult[0].totalCalories
    })).then(() => {
      res.sendFile(path.join(__dirname, "./public/log.html"));
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
  db.Workout.findById(
    req.params._id).populate("exercises")
    .then(oneWorkout => {
      res.json(oneWorkout);
    }).catch(err => {
      res.status(400).json(err);
    });
});

//Get all log entries
app.get("/api/log", function(req, res){
  db.Log.find({})
    .then(log => {
      res.json(log);
    }).catch(err => {
      res.status(400).json(err);
    });
});

// delete api routes ******************************************************

//Find a workout by id and delete all exercises associated with it and delete the workout
app.delete("/api/workouts/:_id", function(req, res){
  db.Workout.findById(req.params._id, function(err, workout){
    db.Exercise.remove({
      "_id": {
        $in: workout.exercises
      }
    }, function(err) {
      if(err) {
        return err;
      }
      workout.remove();
      res.redirect("/");
    });
  });
});

app.delete("/api/exercises/:_id", function(req, res){
  db.Exercise.findByIdAndRemove(req.params._id, function(err){
    if(err) {
      return err;
    }
    db.Workout.update(
      {
        exercises: req.params._id
      },{
        $pull: {"exercises": req.params._id}
      }, function(err) {
        if (err) {
          return err;
        }
        res.json();
      }
    );
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

app.get("/log", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/log.html"));
});

//start server on port ******************************************************

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});

