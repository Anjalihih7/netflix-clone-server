const express = require("express");
const cache = require("../routeCache");
const {
  register,
  getallUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require("../controllers/userController");
const { isAuthenticatedUser } = require("../middlewares/auth");

const router = express.Router();

//Register
router.route("/register").post(register);

//Login
router.route("/login").post(loginUser);

//Logout
router.route("/logout").post(logout);

//Forgot password
router.route("/password/forgot").post(forgotPassword);

//Reset password
router.route("/password/reset/:token").post(resetPassword);

//Update password
router.route("/password/update").put(isAuthenticatedUser, updatePassword);

//Get all user
router.route("/get-all-user").get(getallUser);

module.exports = router;
