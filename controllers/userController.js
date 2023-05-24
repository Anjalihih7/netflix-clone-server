const catchAsyncError = require("../middlewares/catchAsyncError");
const UserModel = require("../models/UserModel");
const ErrorHandler = require("../utils/errorHandler");

exports.createUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);

  const newUser = await UserModel.create({
    email,
    password,
  });

  res.status(201).json(newUser);
});

exports.getallUser = catchAsyncError(async (req, res, next) => {
  const newUser = await UserModel.find();

  res.status(201).json({ newUser });
});
