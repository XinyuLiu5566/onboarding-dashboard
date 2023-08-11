const mongoose = require("mongoose");
const { Schema } = mongoose;

const User = require("./user.model");
const FacilityReport = require("./facilityReport.model");

const houseSchema = new Schema({
  address: { type: Schema.Types.ObjectId, ref: "Address" },
  landlordName: { type: String, required: true },
  landlordPhone: { type: String, required: true },
  landlord_email: { type: String, required: true },
  residentsNum: { type: Number, required: true },
  bedsNum: { type: Number, required: true },
  mattressesNum: { type: Number, required: true },
  tablesNum: { type: Number, required: true },
  chairsNum: { type: Number, required: true },
  facilityReports: [{ type: Schema.Types.ObjectId, ref: "FacilityReport" }],
  employees: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const House = mongoose.model("House", houseSchema, "House");
module.exports = House;