const UserModel = require("../models/UserModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const JWT = require("jsonwebtoken");

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  const { accessToken } = req.cookies;
  console.log("req.cookies", accessToken);

  if (!accessToken) {
    return next(new ErrorHandler("Please Login to access this resource", 401));
  }
  const decodedata = JWT.verify(accessToken, process.env.JWT_SECRET);
  req.user = await UserModel.findById(decodedata.id);
  next();
});
