const mongoose = require("mongoose");

const AppSchema = new mongoose.Schema({
  boards: [String], // Array of boards
});
const AppModel = mongoose.model("AppModel", AppSchema);

module.exports = AppModel;
