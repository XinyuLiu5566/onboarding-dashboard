const mongoose = require("mongoose");
const { Schema } = mongoose;

const User = require("./user.model");
const FacilityReportComment = require("./facilityReportComment.model");

const facilityReportSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  timestamp: { type: Date, required: true },
  status: {
    type: String,
    enum: ["open", "in progress", "closed"],
    required: true,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "FacilityReportComment",
    },
  ],
});

const FacilityReport = mongoose.model(
  "FacilityReport",
  facilityReportSchema,
  "FacilityReport"
);

module.exports = FacilityReport;
