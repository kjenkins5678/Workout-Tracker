const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
  name: String,
  duration: Number,
  calories: Number
});

const Exercise = mongoose.model("Exercise", ExerciseSchema);

module.exports = Exercise;
