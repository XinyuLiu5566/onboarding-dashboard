const mongoose = require("mongoose");
const User = require("../models/user.model");
const Address = require("../models/address.model");
const CarInfo = require("../models/carInfo.model");
const Reference = require("../models/reference.model");
const CitizenStatus = require("../models/citizenStatus.model");
const DriverLicense = require("../models/driverLicense.model");
const EmergencyContact = require("../models/emergencyContact.model");
const House = require("../models/house.model");
const Registration = require("../models/registration.model");
const FacilityReport = require("../models/facilityReport.model");
const FacilityReportComment = require("../models/facilityReportComment.model");
const bcrypt = require("bcrypt");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const crypto = require("crypto");

// Requests for Login Routes
exports.post_login = async (req, res) => {
  console.log("yo");
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }
    const passwordIsCorrect = await bcrypt.compare(password, user.password);
    if (!passwordIsCorrect) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const data = {
      id: user._id,
      username: user.username,
    };
    const options = {
      expiresIn: "3h",
    };
    const token = jwt.sign(data, process.env.JWT_SECRET, options);
    res.status(200).json({ data, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.post_logout = async (req, res) => {
  try {
    const { username } = req.body;
    // Check if the username and password are valid
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Not logged in" });
    }
    const data = {
      id: user._id,
      username: user.username,
    };
    // Send the user info back
    res.status(200).json({ data });
  } catch (e) {
    console.log(e);
    return res.status(404).json({ message: "Not logged in" });
  }
};

// Requests for Employee User Profiles Routes
exports.get_userList = async (req, res) => {
  try {
    const users = await User.find({ role: "employee" })
      .populate("currentAddress")
      .populate("carInformation")
      .populate("citizenStatus")
      .populate("driverLicense")
      .populate("reference")
      .populate("emergencyContacts")
      .populate("house");

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// Requests for Visa Status Routes
exports.get_visaStatusList = async (req, res) => {
  try {
    console.log("yo");
    const users = await User.find()
      .populate("currentAddress")
      .populate("carInformation")
      .populate("citizenStatus")
      .populate("driverLicense")
      .populate("reference")
      .populate("emergencyContacts")
      .populate("house");

    const usersVisas = users.filter((user) => {
      const { citizenStatus } = user;
      return citizenStatus && citizenStatus.workAuthorization === "F1(CPT/OPT)";
    });
    res.json(usersVisas);
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

// PUT request to update OPT receipt status
exports.put_optReceipt = async (req, res) => {
  const { id } = req.params;
  const { optReceiptStatus, feedback } = req.body;
  try {
    const user = await User.findById(id).populate("citizenStatus");
    user.citizenStatus.optReceipt.status = optReceiptStatus;
    user.citizenStatus.optReceipt.feedback = feedback;
    await user.citizenStatus.save();
    console.log(user.citizenStatus);
    res.json(user.citizenStatus.optReceipt);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// PUT request to update OPT EAD status
exports.put_optEad = async (req, res) => {
  const { id } = req.params;
  const { optEadStatus, feedback } = req.body;

  try {
    const user = await User.findById(id).populate("citizenStatus");
    user.citizenStatus.optEad.status = optEadStatus;
    user.citizenStatus.optEad.feedback = feedback;
    await user.citizenStatus.save();
    res.json(user.citizenStatus.optEad);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// PUT request to update I-983 status
exports.put_i983 = async (req, res) => {
  const { id } = req.params;
  const { i983Status, feedback } = req.body;

  try {
    const user = await User.findById(id).populate("citizenStatus");
    user.citizenStatus.i983.status = i983Status;
    user.citizenStatus.i983.feedback = feedback;
    await user.citizenStatus.save();
    res.json(user.citizenStatus.i983);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// PUT request to update I-20 status
exports.put_i20 = async (req, res) => {
  try {
    const { id } = req.params;
    const { i20Status, feedback } = req.body;
    const user = await User.findById(id).populate("citizenStatus");
    user.citizenStatus.i20.status = i20Status;
    user.citizenStatus.i20.feedback = feedback;
    if (user.citizenStatus.i20.status === "Approved") {
      user.citizenStatus.allDocumentsApproved = true;
    }
    await user.citizenStatus.save();
    res.json(user.citizenStatus.i20);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// Requests for Hiring Management Page Routes
exports.post_createUser = async (req, res) => {
  try {
    const token = crypto.randomBytes(32).toString("hex");
    const registrationLink = `${process.env.REGISTRATION_URL}/register?token=${token}`;
    const { GMAIL_USERNAME, GMAIL_PASSWORD } = process.env;

    const registration = new Registration({
      email: req.body.email,
      name: req.body.name,
      registrationLink: registrationLink,
    });
    console.log("account", {
      user: GMAIL_USERNAME,
      pass: GMAIL_PASSWORD,
    });

    await registration.save();
    const transporter = nodemailer.createTransport(
      smtpTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        auth: {
          user: GMAIL_USERNAME,
          pass: GMAIL_PASSWORD,
        },
      })
    );

    const mailOptions = {
      from: GMAIL_USERNAME,
      to: req.body.email,
      subject: "Registration Link for The Company HR Website",
      text: `Please follow this link to complete your registration: \n ${registrationLink}`,
    };
    await transporter.sendMail(mailOptions);
    res.status(201).json({
      status: "success",
      data: {
        registration,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.get_applicationList = async (req, res) => {
  try {
    const users = await User.find({ role: "employee" }).populate(
      "currentAddress carInformation citizenStatus driverLicense reference emergencyContacts house"
    );
    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.put_application = async (req, res) => {
  try {
    const userId = req.params.id;
    const { isApproved, applicationFeedback } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      {
        isApproved: isApproved,
        applicationFeedback: applicationFeedback,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "No user found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// Requests for Housing Routes
exports.get_houseList = async (req, res) => {
  try {
    const houses = await House.find().populate(
      "address residentsNum facilityReports employees"
    );

    res.status(200).json({
      status: "success",
      results: houses.length,
      data: {
        houses,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.post_house = async (req, res) => {
  try {
    // save address
    const address = new Address({
      street: req.body.addressStreet,
      city: req.body.addressCity,
      state: req.body.addressState,
      zip: req.body.addressZipcode,
    });
    await address.save();

    // save house
    const houseData = {
      ...req.body,
      address: address._id,
    };
    const house = new House(houseData);
    await house.save();

    res.status(201).json({
      status: "success",
      data: {
        house,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.get_facilityReportList = async (req, res) => {
  try {
    const { id } = req.params;
    const house = await House.findById(id).populate({
      path: "facilityReports",
      populate: {
        path: "comments",
      },
    });
    // If the report is not found, return a 404 error
    if (!house) {
      return res.status(404).send("Facility report not found");
    }
    const reports = house.facilityReports;
    res.status(200).json({
      status: "success",
      results: reports.length,
      data: {
        reports,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.post_facilityReportComment = async (req, res) => {
  try {
    const { id } = req.params; // Facility Report id
    const { userId, description } = req.body; // Report id and comment description

    // Find house by id
    const report = await FacilityReport.findById(id);
    if (!report) {
      return res.status(404).send("Facility report not found");
    }

    // Create new comment
    const comment = new FacilityReportComment({
      facilityReport: id,
      description: description,
      createdBy: userId,
      timestamp: Date.now(),
    });

    // Save the comment to database
    await comment.save();

    // Push the comment into the comments array of the report
    report.comments.push(comment);

    // Save the house with the updated report
    await report.save();

    res.status(201).json({
      status: "success",
      data: {
        comment,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.put_facilityReportComment = async (req, res) => {
  try {
    const { id } = req.params; // Facility Report id and Comment id
    const { description } = req.body; // Updated comment description

    // Find report by id
    const comment = await FacilityReportComment.findById(id);
    if (!comment) {
      return res.status(404).send("Facility report not found");
    }

    // Update the comment's description
    comment.description = description;
    comment.timestamp = Date.now(); // Update the timestamp as well

    // Save the report with the updated comment
    await comment.save();

    res.status(200).json({
      status: "success",
      data: {
        comment,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
