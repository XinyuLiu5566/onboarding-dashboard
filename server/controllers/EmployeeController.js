const mongoose = require("mongoose");
const User = require("../models/user.model");
const Address = require("../models/address.model");
const CarInfo = require("../models/carInfo.model");
const EmergencyContact = require("../models/emergencyContact.model");
const CitizenStatus = require("../models/citizenStatus.model");
const DriverLicense = require("../models/driverLicense.model");
const House = require("../models/house.model");
const bcrypt = require("bcrypt");
const FacilityReportComment = require("../models/facilityReportComment.model");
const Reference = require("../models/reference.model");
const { body, validationResult } = require("express-validator");
const path = require("path");
const FacilityReport = require("../models/facilityReport.model");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const { uploadFile } = require("../public/scripts/s3Uploader");
const jwt = require("jsonwebtoken");

// const nodemailer = require("nodemailer");
// const smtpTransport = require("nodemailer-smtp-transport");
// const { GMAIL_USERNAME } = process.env;
// const { GMAIL_PASSWORD } = process.env;

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId)
      .populate("currentAddress")
      .populate("carInformation")
      .populate("driverLicense")
      .populate("reference")
      .populate("emergencyContacts")
      .populate("citizenStatus")
      .exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.editPersonalInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    let {
      firstName,
      lastName,
      middleName,
      preferredName,
      username,
      gender,
      ssn,
      dateOfBirth,
      cellPhoneNumber,
      workPhoneNumber,
      reference,
      currentAddress,
      emergencyContacts,
    } = req.body;

    currentAddress = JSON.parse(currentAddress);
    reference = JSON.parse(reference);
    const profilePicture = req.files.profilePicture
      ? req.files.profilePicture[0]
      : null;
    const uploadedLicense = req.files.uploadedLicense
      ? req.files.uploadedLicense[0]
      : null;
    const workAuthFile = req.files.workAuthFile
      ? req.files.workAuthFile[0]
      : null;

    let profilePictureUrl = null;
    let uploadedLicenseUrl = null;
    let workAuthFileUrl = null;

    if (profilePicture) {
      profilePictureUrl = await uploadFile(profilePicture);
    } else {
      const user = await User.findById(userId);
      profilePictureUrl = user.profilePicture;
    }

    let driverLicenseId, citizenStatusId;

    if (uploadedLicense) {
      uploadedLicenseUrl = await uploadFile(uploadedLicense);
      const user = await User.findById(userId);
      const driverLicense = await DriverLicense.findByIdAndUpdate(
        user.driverLicense,
        { uploadedLicense: uploadedLicenseUrl },
        { new: true }
      );
      driverLicenseId = driverLicense._id;
    } else {
      const user = await User.findById(userId);
      driverLicenseId = user.driverLicense;
    }

    if (workAuthFile) {
      workAuthFileUrl = await uploadFile(workAuthFile);
      const user = await User.findById(userId);
      const citizenStatus = await CitizenStatus.findByIdAndUpdate(
        user.citizenStatus,
        { file: workAuthFileUrl },
        { new: true }
      );
      citizenStatusId = citizenStatus._id;
    } else {
      const user = await User.findById(userId);
      citizenStatusId = user.citizenStatus;
    }

    const updatedAddress = await Address.findOneAndUpdate(
      { _id: currentAddress._id },
      currentAddress,
      { new: true }
    );

    const updatedReference = await Reference.findOneAndUpdate(
      { _id: reference._id },
      reference,
      { new: true }
    );

    const updatedEmergencyContacts = [];
    for (const contact of JSON.parse(emergencyContacts)) {
      const updatedContact = await EmergencyContact.findOneAndUpdate(
        { _id: contact._id },
        contact,
        { new: true }
      );
      updatedEmergencyContacts.push(updatedContact._id);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        middleName,
        username,
        ssn,
        preferredName,
        profilePicture: profilePictureUrl,
        currentAddress: updatedAddress._id,
        cellPhoneNumber,
        workPhoneNumber,
        dateOfBirth: new Date(dateOfBirth.replace(/"/g, "")),
        gender,
        reference: updatedReference._id,
        emergencyContacts: updatedEmergencyContacts,
        driverLicense: driverLicenseId,
        citizenStatus: citizenStatusId,
      },
      { new: true, useFindAndModify: false }
    )
      .populate("currentAddress")
      .populate("reference")
      .populate("citizenStatus")
      .populate("emergencyContacts")
      .populate("driverLicense");

    console.log("updated successfully");
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserVisa = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("citizenStatus").exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserHouse = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId)
      .populate({
        path: "house",
        populate: [
          {
            path: "address",
          },
          {
            path: "employees",
          },
          {
            path: "facilityReports",
            populate: {
              path: "createdBy",
            },
          },
        ],
      })
      .exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.house.facilityReports = user.house.facilityReports.filter(
      (report) => report.createdBy._id.toString() === userId
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    // check if user exists
    const user = await User.findOne({
      $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
    })
      .populate("currentAddress")
      .populate("carInformation")
      .populate("driverLicense")
      .populate("reference")
      .populate("emergencyContacts")
      .populate("citizenStatus");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or username" });
    }

    // if user exist, check password match
    let comp = await bcrypt.compare(password, user.password);
    console.log(comp);
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // create jwt token
    const data = {
      id: user._id,
      username: user.username,
    };

    const options = {
      expiresIn: "3h",
    };
    const token = jwt.sign(data, process.env.JWT_SECRET, options);
    res.status(201).json({
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    // Validation
    await body("username")
      .notEmpty()
      .withMessage("Username is required")
      .run(req);
    await body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email")
      .run(req);
    await body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password should have at least 6 characters")
      .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), data: req.body });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email is already registered",
      });
    }
    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT)
    );

    // Retrieve all available houses
    const houses = await House.find();

    // Generate a random index for assigning a house
    const randomIndex = Math.floor(Math.random() * houses.length);

    // Retrieve the randomly assigned house
    const assignedHouse = houses[randomIndex];

    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: "employee",
      house: assignedHouse._id,
    });
    await user.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.onboarding = async (req, res) => {
  try {
    const userId = req.user.id;
    let {
      firstName,
      lastName,
      middleName,
      preferredName,
      currentAddress,
      cellPhoneNumber,
      workPhoneNumber,
      carInformation,
      ssn,
      gender,
      dateOfBirth,
      citizenStatus,
      hasDriverLicense,
      driverLicense,
      reference,
      emergencyContacts,
    } = req.body;

    const profilePicture = req.files.profilePicture
      ? req.files.profilePicture[0]
      : null;
    const uploadedLicense = req.files.uploadedLicense
      ? req.files.uploadedLicense[0]
      : null;
    const workAuthFile = req.files.workAuthFile
      ? req.files.workAuthFile[0]
      : null;
    const optReceipt = req.files.optReceipt ? req.files.optReceipt[0] : null;
    let profilePictureUrl = null;
    let uploadedLicenseUrl = null;
    let workAuthFileUrl = null;
    let optReceiptUrl = null;

    if (profilePicture) {
      profilePictureUrl = await uploadFile(profilePicture);
    } else {
      const user = await User.findById(userId);
      profilePictureUrl = user.profilePicture;
    }

    if (uploadedLicense) {
      uploadedLicenseUrl = await uploadFile(uploadedLicense);
    }

    if (workAuthFile) {
      workAuthFileUrl = await uploadFile(workAuthFile);
    }

    if (optReceipt) {
      optReceiptUrl = await uploadFile(optReceipt);
    }

    currentAddress = JSON.parse(currentAddress);
    carInformation = JSON.parse(carInformation);
    driverLicense = JSON.parse(driverLicense);
    driverLicense.uploadedLicense = uploadedLicenseUrl;
    citizenStatus = JSON.parse(citizenStatus);
    citizenStatus.file = workAuthFileUrl;
    citizenStatus.optReceipt.file = optReceiptUrl;
    reference = JSON.parse(reference);

    hasDriverLicense = hasDriverLicense === "Yes";

    console.log(driverLicense);
    const savedAddress = await Address.create(currentAddress);
    const savedCarInfo = await CarInfo.create(carInformation);
    const savedDriverLicence = await DriverLicense.create(driverLicense);
    const savedCitizenStatus = await CitizenStatus.create(citizenStatus);
    const savedReference = await Reference.create(reference);
    const savedEmergencyContacts = [];
    for (const contact of JSON.parse(emergencyContacts)) {
      const savedContact = await EmergencyContact.create(contact);
      savedEmergencyContacts.push(savedContact._id);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, {
      firstName,
      lastName,
      middleName,
      profilePicture: profilePictureUrl,
      preferredName,
      currentAddress: savedAddress._id,
      cellPhoneNumber,
      workPhoneNumber,
      carInformation: savedCarInfo._id,
      ssn,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      citizenStatus: savedCitizenStatus._id,
      hasDriverLicense,
      driverLicense: savedDriverLicence ? savedDriverLicence._id : null,
      reference: savedReference._id,
      emergencyContacts: savedEmergencyContacts,
      isApproved: "Pending",
    });

    console.log("onboarding success");
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.editOnboardingInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      firstName,
      lastName,
      middleName,
      preferredName,
      building,
      street,
      city,
      state,
      zip,
      cellPhoneNumber,
      workPhoneNumber,
      make,
      model,
      color,
      email,
      ssn,
      gender,
      dateOfBirth,
      isCitizenOrPermanentResident,
      greenCardOrCitizen,
      workAuthorization,
      otherVisaTitle,
      startDate,
      endDate,
      hasDriverLicense,
      licenseNumber,
      expirationDate,
      refFirstName,
      refLastName,
      refMiddleName,
      refPhone,
      refEmail,
      refRelationship,
      emergencyContacts,
    } = req.body;

    const profilePicture = req.files.profilePicture[0];
    const workAuthFile = req.files.workAuthFile[0];
    const optReceipt = req.files.optReceipt[0];
    const uploadedLicense = req.files.uploadedLicense[0];

    // Upload workAuthFile and optReceipt to S3 (if they exist)
    const workAuthFileUrl = workAuthFile
      ? await uploadFile(workAuthFile)
      : null;
    const optReceiptUrl = optReceipt ? await uploadFile(optReceipt) : null;
    const uploadedLicenseUrl = uploadedLicense
      ? await uploadFile(uploadedLicense)
      : null;
    const profilePictureUrl = profilePicture
      ? await uploadFile(profilePicture)
      : null;

    // Create and save Address
    const newAddress = new Address({ building, street, city, state, zip });
    const savedAddress = await newAddress.save();

    // Create and save CarInfo
    const newCarInfo = new CarInfo({ make, model, color });
    const savedCarInfo = await newCarInfo.save();

    // Create and save DriverLicense (if applicable)
    let savedDriverLicense = null;
    if (hasDriverLicense) {
      const driverLicense = new DriverLicense({
        licenseNumber,
        expirationDate,
        file: uploadedLicenseUrl,
      });
      savedDriverLicense = await driverLicense.save();
    }

    // Create and save Reference
    const reference = new Reference({
      firstName: refFirstName,
      lastName: refLastName,
      middleName: refMiddleName,
      phone: refPhone,
      email: refEmail,
      relationship: refRelationship,
    });
    const savedReference = await reference.save();

    // Create and save EmergencyContacts
    const savedEmergencyContacts = [];
    for (const contact of emergencyContacts) {
      const newEmergencyContact = new EmergencyContact(contact);
      const savedContact = await newEmergencyContact.save();
      savedEmergencyContacts.push(savedContact._id);
    }

    // Create a new CitizenStatus document
    const newCitizenStatus = new CitizenStatus({
      isCitizenOrPermanentResident: isCitizenOrPermanentResident === "true",
      greenCardOrCitizen,
      workAuthorization,
      otherVisaTitle,
      startDate,
      endDate,
      optReceipt,
      file: workAuthFileUrl,
      optReceipt: optReceiptUrl,
    });
    const savedCitizenStatus = await newCitizenStatus.save();

    const updatedUser = await User.findByIdAndUpdate(userId, {
      firstName,
      lastName,
      middleName,
      preferredName,
      profilePicture: profilePictureUrl,
      currentAddress: savedAddress._id,
      cellPhoneNumber,
      workPhoneNumber,
      carInformation: savedCarInfo._id,
      ssn,
      dateOfBirth,
      gender,
      citizenStatus: savedCitizenStatus._id,
      hasDriverLicense,
      driverLicense: savedDriverLicense ? savedDriverLicense._id : null,
      reference: savedReference._id,
      emergencyContacts: savedEmergencyContacts,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitOPT = async (req, res) => {
  try {
    const userId = req.user.id;

    const optReceipt = req.files.optReceipt ? req.files.optReceipt[0] : null;

    let optReceiptUrl = null;
    let citizenStatusId;

    if (optReceipt) {
      optReceiptUrl = await uploadFile(optReceipt);
      const user = await User.findById(userId);
      const citizenStatus = await CitizenStatus.findByIdAndUpdate(
        user.citizenStatus,
        { "optReceipt.file": optReceiptUrl },
        { new: true }
      );
      citizenStatusId = citizenStatus._id;
    } else {
      const user = await User.findById(userId);
      citizenStatusId = user.citizenStatus;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        citizenStatus: citizenStatusId,
      },
      { new: true, useFindAndModify: false }
    ).populate("citizenStatus");
    console.log("updated successfully");
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitEAD = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitI20 = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitI983 = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitFacilityReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description } = req.body;

    const newFacilityReport = new FacilityReport({
      title,
      description,
      createdBy: userId,
      timestamp: Date.now(),
      status: "open",
    });

    const savedFacilityReport = await newFacilityReport.save();

    const user = await User.findById(userId).populate("house").exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await House.findByIdAndUpdate(
      user.house,
      { $push: { facilityReports: savedFacilityReport._id } },
      { new: true }
    );

    res.status(201).json(savedFacilityReport);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllFacilityReports = async (req, res) => {
  try {
    const userId = req.user.id;
    const facilityReports = await FacilityReport.find({
      createdBy: userId,
    })
      .populate("createdBy")
      .exec();
    res.status(200).json(facilityReports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitFacilityReportComment = async (req, res) => {
  try {
    const reportId = req.params.reportId;
    const userId = req.user.id;
    const { description } = req.body;
    const facilityReport = await FacilityReport.findById(reportId);
    if (!facilityReport) {
      return res.status(404).json({ message: "Facility report not found" });
    }

    const newComment = new FacilityReportComment({
      facilityReport: reportId,
      description,
      createdBy: userId,
      timestamp: Date.now(),
    });

    const savedComment = await newComment.save();

    facilityReport.comments.push(savedComment._id);
    await facilityReport.save();

    res.status(200).json(savedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.editFacilityReportComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const { description } = req.body;

    const facilityReportComment = await FacilityReportComment.findById(
      commentId
    );

    if (!facilityReportComment) {
      return res
        .status(404)
        .json({ message: "Facility report comment not found" });
    }
    facilityReportComment.description = description;
    await facilityReportComment.save();
    res.status(200).json(facilityReportComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get this feature later
// exports.sendEmail = async (req, res) => {
//   let transporter = nodemailer.createTransport(
//     smtpTransport({
//       service: "gmail",
//       host: "smtp.gmail.com",
//       auth: {
//         user: GMAIL_USERNAME,
//         pass: GMAIL_PASSWORD,
//       },
//     })
//   );

//   const mailOptions = {
//     from: GMAIL_USERNAME,
//     to: "sxinyu0117@gmail.com",
//     subject: "Subject",
//     text: "Email content",
//   };

//   transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//       console.log(error);
//       res.status(500).json({ message: error.message });
//     } else {
//       console.log("Email sent: " + info.response);
//       res.status(200).json({ message: "Email sent successfully" });
//     }
//   });
// };
