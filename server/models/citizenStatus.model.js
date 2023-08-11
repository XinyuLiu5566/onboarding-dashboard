const mongoose = require("mongoose");
const { Schema } = mongoose;

const citizenStatusSchema = new Schema({
  isCitizenOrPermanentResident: { type: Boolean, required: true },
  greenCardOrCitizen: {
    type: String,
    enum: ["Green Card", "Citizen"],
    required: function () {
      return this.isCitizenOrPermanentResident;
    },
  },
  workAuthorization: {
    type: String,
    required: function () {
      return !this.isCitizenOrPermanentResident;
    },
  },
  otherVisaTitle: {
    type: String,
    required: function () {
      return this.workAuthorization === "Other";
    },
  },
  file: { type: String },
  startDate: Date,
  endDate: Date,
  optReceipt: {
    file: { type: String },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    feedback: { type: String },
  },
  optEad: {
    file: { type: String },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    feedback: { type: String },
  },
  i983: {
    file: { type: String },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    feedback: { type: String },
  },
  i20: {
    file: { type: String },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    feedback: { type: String },
  },
  allDocumentsApproved: { type: Boolean, default: false },
});

const CitizenStatus = mongoose.model(
  "CitizenStatus",
  citizenStatusSchema,
  "CitizenStatus"
);

module.exports = CitizenStatus;
