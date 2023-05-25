//Create a token and saving in cookie

const sendToken = (res, user, statusCode) => {
  //cookie value
  const token = user.getJwtToken();
  //   console.log("token", token);

  //cookie configs
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
  };

  res.status(statusCode).cookie("accessToken", token, options).json({
    success: true,
    message: "Logged in successfully",
    token,
  });
};
module.exports = sendToken;
