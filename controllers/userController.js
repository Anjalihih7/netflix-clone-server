const catchAsyncError = require("../middlewares/catchAsyncError");
const UserModel = require("../models/UserModel");
const ErrorHandler = require("../utils/errorHandler");
const crypto = require("crypto");
const sendToken = require("../utils/sendToken");
const sendEmail = require("../utils/sendEmail");

//Register
exports.register = catchAsyncError(async (req, res, next) => {
  const { username, email, password } = req.body;
  // console.log(req.body);

  const newUser = await UserModel.create({
    username,
    email,
    password,
  });

  res.status(201).json(newUser);
});

//Login
exports.loginUser = catchAsyncError(async (req, res, next) => {
  // console.log("res", res.status(200));
  const { email, password } = req.body;

  if (!email && !password) {
    return next(new ErrorHandler("Please Enter Email and Password", 400));
  }

  const user = await UserModel.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid username and password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);
  // console.log("isPasswordMatched", isPasswordMatched);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid username and password", 401));
  }
  user.getJwtToken();

  // console.log(user);
  // res.status(201).json(user);
  sendToken(res, user, 201);
});

//Logout
exports.logout = catchAsyncError(async (req, res, next) => {
  res
    .status(201)
    .cookie("accessToken", null, {
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

//Get all users
exports.getallUser = catchAsyncError(async (req, res, next) => {
  const user = await UserModel.find();

  res.status(201).json({ user });
});

//Foget password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const resetToken = user.getResetPasswordToken();

  await user.save();

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  const message = `Your  Password Reset Token is :- \n\n ${resetPasswordUrl} \n\nif you have not requested this email then, please ignore it`;

  try {
    sendEmail({
      email: user.email,
      subject: "Password recovery",
      message: message,
    });
    res.status(201).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(err.message, 500));
  }
});

//Reeset password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  //creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await UserModel.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  console.log(user);

  if (!user) {
    return next(
      new ErrorHandler(
        "reset Password Token is invalid or has been expired",
        404
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 404));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(res, user, 201);
});

//Update password
exports.updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await UserModel.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  console.log(isPasswordMatched);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 401));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(res, user, 200);
});
