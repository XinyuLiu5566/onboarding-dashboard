const mongoose = require("mongoose");
const { Schema } = mongoose;

const registrationSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  registrationLink: {
    type: String,
    required: true,
  },
  tokenCreatedAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 3, // This field will automatically be removed after 3 hours.
  },
  registrationStatus: {
    type: String,
    enum: ["pending", "success"],
    default: "pending",
  },
});

const Registration = mongoose.model(
  "Registration",
  registrationSchema,
  "Registration"
);
module.exports = Registration;
