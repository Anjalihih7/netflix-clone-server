const ErrorHandler = require("../utils/errorHandler.js");

const errorHanlder = (err, req, res, next) => {
  console.log("errrrr", err);
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  //wrong Mongodb ID error
  if (err.name === "CastError") {
    const message = `Resourse not found: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }
  //Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }
  //ValidationError
  if (err.message === "ValidationError") {
    const message = `Resourse not found: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }
  //Json web token error
  if (err.code === "JsonWebTokenError") {
    const message = `Json web Token is Invalid. Try again.`;
    err = new ErrorHandler(message, 400);
  }
  //Token Expire Error
  if (err.code === "TokenExpireError") {
    const message = `Json web Token is Expired. Try again.`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

module.exports = errorHanlder;
