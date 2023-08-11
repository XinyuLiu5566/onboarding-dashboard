const mongoose = require("mongoose");
const { Schema } = mongoose;

const addressSchema = new Schema({
  building: String,
  street: String,
  city: String,
  state: String,
  zip: String,
});

const Address = mongoose.model("Address", addressSchema, "Address");
module.exports = Address;
