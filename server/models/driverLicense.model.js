const mongoose = require("mongoose");
const { Schema } = mongoose;

const driverLicenseSchema = new Schema({
  licenseNumber: { type: String },
  expirationDate: { type: Date },
  uploadedLicense: { type: String },
});

const DriverLicense = mongoose.model(
  "DriverLicense",
  driverLicenseSchema,
  "DriverLicense"
);

module.exports = DriverLicense;
