const mongoose = require("mongoose");
const { Schema } = mongoose;

const carInfoSchema = new Schema({
  make: String,
  model: String,
  color: String,
});

const CarInfo = mongoose.model("CarInfo", carInfoSchema, "CarInfo");
module.exports = CarInfo;
