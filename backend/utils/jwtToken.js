// ---------------------------------------------
// send token to client 
// ---------------------------------------------
const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "PRODUCTION") {
    cookieOptions.secure = true;
  }
  res.status(statusCode).cookie("token", token, cookieOptions).json({
    success: true,
    token,
    user,
  });
};


module.exports = sendToken;