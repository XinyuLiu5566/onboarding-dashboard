const mongoose = require("mongoose");
const { Schema } = mongoose;

const emergencyContactSchema = new Schema({
  firstName: String,
  lastName: String,
  middleName: String,
  phone: String,
  email: String,
  relationship: String,
});

const EmergencyContact = mongoose.model(
  "EmergencyContact",
  emergencyContactSchema,
  "EmergencyContact"
);

module.exports = EmergencyContact;
