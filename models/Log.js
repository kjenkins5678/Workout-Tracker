const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LogSchema = new Schema({
  name: String,
  date: {
    type: Date,
    default: Date.now
  },
  calories: Number
});

const Log = mongoose.model("Log", LogSchema);

module.exports = Log;