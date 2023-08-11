const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const { MONGO_URL } = process.env;
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/user.model");
const Address = require("../models/address.model");
const CarInfo = require("../models/carInfo.model");
const CitizenStatus = require("../models/citizenStatus.model");
const DriverLicense = require("../models/driverLicense.model");
const EmergencyContact = require("../models/emergencyContact.model");
const FacilityReport = require("../models/facilityReport.model");
const FacilityReportComment = require("../models/facilityReportComment.model");
const Reference = require("../models/reference.model");
const House = require("../models/house.model");

async function dropCollectionIfExists(model) {
  try {
    await model.collection.drop();
  } catch (err) {
    if (err.code === 26) {
      console.log(`${model.modelName} collection does not exist`);
    } else {
      throw err;
    }
  }
}

async function run() {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
    });
    console.log("Seeding DB.");
    // Reset
    await Promise.all([
      dropCollectionIfExists(User),
      dropCollectionIfExists(CarInfo),
      dropCollectionIfExists(CitizenStatus),
      dropCollectionIfExists(DriverLicense),
      dropCollectionIfExists(EmergencyContact),
      dropCollectionIfExists(FacilityReport),
      dropCollectionIfExists(FacilityReportComment),
      dropCollectionIfExists(Reference),
      dropCollectionIfExists(Address),
      dropCollectionIfExists(House),
    ]);

    const newAddress = await Address.create({
      street: "892 Momona St",
      city: "Honolulu",
      state: "Hawaii",
      zip: "96820",
    });

    const newCar = await CarInfo.create({
      make: "Ferrari",
      model: "SF90",
      color: "Red",
    });

    const newCitizenStatus = await CitizenStatus.create({
      isCitizenOrPermanentResident: false,
      workAuthorization: "F1(CPT/OPT)",
      file: "https://chris-david-onboarding-app.s3.amazonaws.com/F1.pdf",
      optReceipt: {
        file: "https://chris-david-onboarding-app.s3.amazonaws.com/OPT-Receipt.pdf",
        status: "Approved",
      },
      startDate: "2023-06-18",
      endDate: "2024-06-18",
      optEad: {
        file: "https://chris-david-onboarding-app.s3.amazonaws.com/OPT-EAD.pdf",
        status: "Approved",
      },
      i983: {
        file: "https://chris-david-onboarding-app.s3.amazonaws.com/I-983-User.pdf",
        status: "Pending",
      },
    });

    const newDriverLicense = await DriverLicense.create({
      licenseNumber: "014787441",
      expirationDate: "2022-01-01",
      uploadedLicense:
        "https://chris-david-onboarding-app.s3.amazonaws.com/Drivers-License.jpg",
    });

    const newReference = await Reference.create({
      firstName: "Bob",
      lastName: "Marley",
      middleName: "Weston",
      phone: "230-1040-1401",
      email: "bobsmith@gmail.com",
      relationship: "Former Boss",
    });

    const emergencyContacts = [];
    emergencyContacts.push({
      firstName: "John",
      lastName: "Smith",
      middleName: "Baxtor",
      phone: "243-241-1245",
      email: "baxter142@gmail.com",
      relationship: "Dad",
    });
    emergencyContacts.push({
      firstName: "Amanda",
      lastName: "Smith",
      middleName: "Sam",
      phone: "243-142-1412",
      email: "amanda@gmail.com",
      relationship: "Mom",
    });
    const insertManyEmergencyContacts = await EmergencyContact.insertMany(
      emergencyContacts
    );
    const emergencyContactsIds = insertManyEmergencyContacts.map(
      (contact) => contact._id
    );

    console.log(newAddress._id);
    console.log(newDriverLicense._id);

    // Create a employee User
    const newUser = await User.create({
      username: "mclovingit",
      password: await bcrypt.hash("Juice1", 10),
      role: "employee",
      firstName: "Mclovin",
      lastName: "Smith",
      middleName: "Fogell",
      preferredName: "Mclovin",
      profilePicture:
        "https://chris-david-onboarding-app.s3.amazonaws.com/profile.png",
      currentAddress: newAddress._id,
      cellPhoneNumber: "408-408-4080",
      workPhoneNumber: "501-501-5010",
      carInformation: newCar._id,
      email: "david94539@gmail.com",
      ssn: "666-666-6666",
      dateOfBirth: "2001-06-18",
      gender: "male",
      citizenStatus: newCitizenStatus._id,
      hasDriverLicense: true,
      driverLicense: newDriverLicense._id,
      reference: newReference._id,
      emergencyContacts: emergencyContactsIds,
    });

    // Create a HR user
    const newUser2 = await User.create({
      username: "theboss123",
      password: await bcrypt.hash("Juice1", 10),
      role: "hr",
      hasDriverLicense: false,
    });

    // Create some facility reports for the house
    const newFacilityReport1 = await FacilityReport.create({
      title: "Broken toilet",
      description: "The toilet in the main bathroom is broken.",
      createdBy: newUser._id,
      timestamp: new Date(),
      status: "open",
    });

    const facilityReportComment = await FacilityReportComment.create({
      facilityReport: newFacilityReport1._id,
      description: "Called the plumber. Coming this Friday.",
      createdBy: newUser2._id,
      timestamp: "2022-01-01",
    });

    const facilityReportComment2 = await FacilityReportComment.create({
      facilityReport: newFacilityReport1._id,
      description: "Okay thank you.",
      createdBy: newUser._id,
      timestamp: "2022-01-02",
    });

    await FacilityReport.findByIdAndUpdate(
      newFacilityReport1._id,
      { comments: [facilityReportComment._id, facilityReportComment2._id] },
      { new: true }
    );

    const newFacilityReport2 = await FacilityReport.create({
      title: "Leaky faucet",
      description: "The faucet in the kitchen sink is leaking.",
      createdBy: newUser._id,
      timestamp: new Date(),
      status: "open",
    });

    // Create a new house
    const newHouse = await House.create({
      address: newAddress._id,
      landlordName: "Jane Smith",
      landlordPhone: "123-456-7890",
      landlord_email: "janesmith@example.com",
      residentsNum: 5,
      bedsNum: 3,
      mattressesNum: 4,
      tablesNum: 1,
      chairsNum: 6,
      facilityReports: [newFacilityReport1._id, newFacilityReport2._id],
      employees: [newUser._id],
    });

    await User.findByIdAndUpdate(
      newUser._id,
      { house: newHouse._id },
      { new: true }
    );
  } catch (err) {
    console.log(err);
  } finally {
    await mongoose.connection.close();
  }
}

run().catch(console.dir);
