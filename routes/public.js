const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth");
const validate = require("express-validation");
const authValidation = require("../validations/auth");
const authorize = require("../middleware/authorize")
const users = require("../controllers/users");
const domains = require("../controllers/domains");
const users_domains = require("../controllers/user_domain");
const reports = require("../controllers/reports");
const final_payable = require("../controllers/final_payable");


router
  .route("/auth/login")
  .post(validate(authValidation.loginParam), auth.login);
router.route("/users/:id").get(authorize.authorize,users.getUserById);
router.route("/users").get(authorize.authorize, users.getAllUsers);
router.route("/user/add").post(authorize.authorize, users.addUser);

router.route("/user/update/:id").put(authorize.authorize, users.updateUser);
router.route("/user/delete/:id").delete(authorize.authorize, users.deleteUser);

router.route("/domains/:id").get(authorize.authorize, domains.getDomainById);
router.route("/domains").get(authorize.authorize, domains.getAllDomains);
router.route("/domain/add").post(authorize.authorize, domains.addDomain);

router.route("/domain/update/:id").put(authorize.authorize, domains.updateDomain);
router.route("/domain/delete/:id").delete(authorize.authorize, domains.deleteDomain);

router.route("/users_domains/:id").get(authorize.authorize, users_domains.getUserDomainById);
router.route("/users_domains_by_user_id/:user_id").get(authorize.authorize, users_domains.getUserDomainByUserId);
router.route("/users_domains").get(authorize.authorize, users_domains.getAllUserDomains);
router.route("/user_domain/add").post(authorize.authorize, users_domains.addUserDomain);
router.route("/user_domain/update/:id").put(authorize.authorize, users_domains.updateUserDomain);
router.route("/user_domain/delete/:user_id/:domain_id").delete(authorize.authorize, users_domains.deleteUserDomain);



router.route("/reports/new").post(authorize.authorize, reports.addReport);
router.route("/reports/all").get(authorize.authorize, reports.getAllFiles);
router.route("/reports/delete/:id").delete(authorize.authorize, reports.deleteFile);

router.route("/homeStats").get( reports.getHomeStats);
router.route("/userHomeStats").get( reports.getUserHomeStats);
router.route("/homeStatsFixed").get( reports.getHomeStatsFixed);
router.route("/userHomeStatsFixed").get( reports.getUserHomeStatsFixed);


router.route("/final-payable/new").post(authorize.authorize, final_payable.addFinalPayable);
router.route("/monthly-payable").get(authorize.authorize, final_payable.getMonthlyReport);
router.route("/user-monthly-payable").get(authorize.authorize, final_payable.getUserMonthlyReport);
router.route("/final_payable/all").get(authorize.authorize, final_payable.getAllFiles);
router.route("/final_payable/delete/:id").delete(authorize.authorize, final_payable.deleteFile);








module.exports = router;
