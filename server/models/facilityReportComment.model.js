const mongoose = require("mongoose");
const { Schema } = mongoose;

const User = require("./user.model");
const FacilityReport = require("./facilityReport.model");

const facilityReportCommentSchema = new Schema({
  facilityReport: {
    type: Schema.Types.ObjectId,
    ref: "FacilityReport",
    required: true,
  },
  description: String,
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  timestamp: { type: Date, required: true },
});

const Comment = mongoose.model(
  "FacilityReportComment",
  facilityReportCommentSchema,
  "FacilityReportComment"
);
module.exports = Comment;
