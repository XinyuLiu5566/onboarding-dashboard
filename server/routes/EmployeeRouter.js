const router = require("express").Router();
const EmployeeController = require("../controllers/EmployeeController");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const auth = require("../middleware/auth");

router.get("/profile", auth, EmployeeController.getUserProfile);
router.put(
  "/profile",
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "workAuthFile", maxCount: 1 },
    { name: "uploadedLicense", maxCount: 1 },
  ]),
  auth,

  EmployeeController.editPersonalInfo
);

router.get("/visa", auth, EmployeeController.getUserVisa);
router.get("/house", auth, EmployeeController.getUserHouse);

router.post("/login", EmployeeController.login);
router.post("/register", EmployeeController.register);
router.post(
  "/onboarding",
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "workAuthFile", maxCount: 1 },
    { name: "optReceipt", maxCount: 1 },
    { name: "uploadedLicense", maxCount: 1 },
  ]),
  auth,
  EmployeeController.onboarding
);
router.put("/onboarding", auth, EmployeeController.editOnboardingInfo);

router.post(
  "/opt-receipt",
  upload.fields([{ name: "optReceipt", maxCount: 1 }]),
  auth,
  EmployeeController.submitOPT
);
router.post(
  "/opt-ead",
  upload.fields([{ name: "optEad", maxCount: 1 }]),
  auth,
  EmployeeController.submitEAD
);
router.post(
  "/i983",
  upload.fields([{ name: "i983", maxCount: 1 }]),
  auth,
  EmployeeController.submitI983
);
router.post(
  "/i20",
  upload.fields([{ name: "i20", maxCount: 1 }]),
  auth,
  EmployeeController.submitI20
);

router.get("/facility-reports", auth, EmployeeController.getAllFacilityReports);
router.post("/facility-report", auth, EmployeeController.submitFacilityReport);
router.post(
  "/facility-report-comment/:reportId",
  auth,
  EmployeeController.submitFacilityReportComment
);
router.put(
  "/facility-report-comment/:commentId",
  auth,
  EmployeeController.editFacilityReportComment
);

// get this later
// router.post("/email", EmployeeController.sendEmail);

module.exports = router;
