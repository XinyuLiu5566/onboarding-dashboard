const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: ["employee", "hr"], required: true },
  firstName: { type: String },
  lastName: { type: String },
  middleName: String,
  preferredName: String,
  profilePicture: {
    type: String,
    default: "https://chris-david-onboarding-app.s3.amazonaws.com/profile.png",
  },
  currentAddress: { type: Schema.Types.ObjectId, ref: "Address" },
  cellPhoneNumber: String,
  workPhoneNumber: String,
  carInformation: { type: Schema.Types.ObjectId, ref: "CarInfo" },
  ssn: String,
  dateOfBirth: Date,
  gender: { type: String, enum: ["male", "female", "i do not wish to answer"] },
  citizenStatus: { type: Schema.Types.ObjectId, ref: "CitizenStatus" },
  hasDriverLicense: { type: Boolean, default: false },
  driverLicense: { type: Schema.Types.ObjectId, ref: "DriverLicense" },
  reference: { type: Schema.Types.ObjectId, ref: "Reference" },
  emergencyContacts: [{ type: Schema.Types.ObjectId, ref: "EmergencyContact" }],
  house: { type: Schema.Types.ObjectId, ref: "House" },
  isApproved: {
    type: String,
    required: true,
    enum: ["not start", "pending", "denied", "approved"],
    default: "not start",
  },
  applicationFeedback: String,
});

const User = mongoose.model("User", userSchema, "User");
module.exports = User;
