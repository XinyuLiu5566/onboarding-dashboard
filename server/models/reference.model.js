const mongoose = require("mongoose");
const { Schema } = mongoose;

const referenceSchema = new Schema({
  firstName: String,
  lastName: String,
  middleName: String,
  phone: String,
  email: String,
  relationship: String,
});

const Reference = mongoose.model("Reference", referenceSchema, "Reference");
module.exports = Reference;
