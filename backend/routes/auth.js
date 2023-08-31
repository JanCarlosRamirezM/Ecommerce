const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

router.route("/auth/register").post(registerUser);
router.route("/auth/login").post(loginUser);
router.route("/auth/logout").get(logoutUser);
router.route("/auth/password/forgot").post(forgotPassword);
router.route("/auth/password/reset/:token").post(resetPassword);

module.exports = router;
