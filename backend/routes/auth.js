const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateProfile,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser
} = require("../controllers/authController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/me").get([isAuthenticatedUser], getUserProfile);
router.route("/me/update").put([isAuthenticatedUser], updateProfile);

// Admin routes
router
  .route("/admin/users")
  .get([isAuthenticatedUser, authorizeRoles("admin")], getAllUsers);

router
  .route("/admin/user/:id")
  .get([isAuthenticatedUser, authorizeRoles("admin")], getSingleUser)
  .put([isAuthenticatedUser, authorizeRoles("admin")], updateUserRole)
  .delete([isAuthenticatedUser, authorizeRoles("admin")], deleteUser);

module.exports = router;
