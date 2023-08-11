const router = require("express").Router();
const HrController = require("../controllers/HrController");

const auth = require("../middleware/auth");

// Login Routes
router.post("/login", HrController.post_login);
router.post("/logout", HrController.post_logout);

// Employee User Profiles Routes
router.get("/user-list", auth, HrController.get_userList);
// router.get("/user/:id", HrController.get_userProfile);

// Visa Status Routes
router.get("/visa-status-list", auth, HrController.get_visaStatusList);
router.put("/opt-receipt/:id", auth, HrController.put_optReceipt);
router.put("/opt-ead/:id", auth, HrController.put_optEad);
router.put("/i983/:id", auth, HrController.put_i983);
router.put("/i20/:id", auth, HrController.put_i20);

// Requests for hiring management page

router.post("/create-user", auth, HrController.post_createUser);
router.get("/application-list", auth, HrController.get_applicationList);
router.put("/application/:id", auth, HrController.put_application);

// Housing Routes

router.get("/house-list", auth, HrController.get_houseList);
router.post("/house", auth, HrController.post_house);
router.get(
  "/facility-report-list/:id",
  auth,
  HrController.get_facilityReportList
);
router.post(
  "/facility-report-comment/:id",
  auth,
  HrController.post_facilityReportComment
);
router.put(
  "/facility-report-comment/:id",
  auth,
  HrController.put_facilityReportComment
);

module.exports = router;
