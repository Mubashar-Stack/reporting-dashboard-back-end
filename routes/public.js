const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth");
const validate = require("express-validation");
const authValidation = require("../validations/auth");
const users = require("../controllers/users");
const domains = require("../controllers/domains");
const users_domains = require("../controllers/user_domain");
const reports = require("../controllers/reports");
const final_payable = require("../controllers/final_payable");


router
  .route("/auth/login")
  .post(validate(authValidation.loginParam), auth.login);
router.route("/users/:id").get(users.getUserById);
router.route("/users").get(users.getAllUsers);
router.route("/user/add").post(users.addUser);

router.route("/user/update/:id").put(users.updateUser);
router.route("/user/delete/:id").delete(users.deleteUser);

router.route("/domains/:id").get(domains.getDomainById);
router.route("/domains").get(domains.getAllDomains);
router.route("/domain/add").post(domains.addDomain);

router.route("/domain/update/:id").put(domains.updateDomain);
router.route("/domain/delete/:id").delete(domains.deleteDomain);

router.route("/users_domains/:id").get(users_domains.getUserDomainById);
router.route("/users_domains_by_user_id/:user_id").get(users_domains.getUserDomainByUserId);
router.route("/users_domains").get(users_domains.getAllUserDomains);
router.route("/user_domain/add").post(users_domains.addUserDomain);
router.route("/user_domain/update/:id").put(users_domains.updateUserDomain);
router.route("/user_domain/delete/:user_id/:domain_id").delete(users_domains.deleteUserDomain);



router.route("/reports/new").post(reports.addReport);
router.route("/reports/all").get(reports.getAllFiles);
router.route("/reports/delete/:id").delete(reports.deleteFile);

router.route("/homeStats").get(reports.getHomeStats);
router.route("/userHomeStats").get(reports.getUserHomeStats);
router.route("/homeStatsFixed").get(reports.getHomeStatsFixed);
router.route("/userHomeStatsFixed").get(reports.getUserHomeStatsFixed);


router.route("/final-payable/new").post(final_payable.addFinalPayable);
router.route("/monthly-payable").get(final_payable.getMonthlyReport);
router.route("/user-monthly-payable").get(final_payable.getUserMonthlyReport);
router.route("/final_payable/all").get(final_payable.getAllFiles);
router.route("/final_payable/delete/:id").delete(final_payable.deleteFile);








module.exports = router;
