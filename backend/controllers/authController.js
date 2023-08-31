const User = require("../models/user");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const httpStatus = require("../utils/httpStatus");
const sendToken = require("../utils/JwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

// ----------------------------------------------
// Create a new user => /api/v1/auth/register
// ----------------------------------------------
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    avatar: {
      public_id: "test",
      url: "test",
    },
  });

  sendToken(user, httpStatus.OK, res);
});

// ----------------------------------------------
// Login User => /api/v1/auth/login
// ----------------------------------------------
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new ErrorHandler(
        "Please enter email and password",
        httpStatus.BAD_REQUEST
      )
    );
  }

  // Fiending user in database
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(
      new ErrorHandler("Invalid email or password", httpStatus.UNAUTHORIZED)
    );
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(
      new ErrorHandler("Invalid email or password", httpStatus.UNAUTHORIZED)
    );
  }

  sendToken(user, httpStatus.OK, res);
});

// ----------------------------------------------
// Logout User => /api/v1/auth/logout
// ----------------------------------------------
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(httpStatus.OK).json({
    success: true,
    message: "Logged out",
  });
});

// ----------------------------------------------
// Forgot Password => /api/v1/password/forgot
// ----------------------------------------------
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found", httpStatus.NOT_FOUND));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Create reset password url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetUrl} \n\n If you have not requested this email then, please ignore it.`;
  try {
    await sendEmail({
      email: user.email,
      subject: `ShopIT Password Recovery`,
      message,
    });
    res.status(httpStatus.OK).json({
      success: true,
      message: `Email sent to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new ErrorHandler(error.message, httpStatus.INTERNAL_SERVER_ERROR)
    );
  }
});

// ----------------------------------------------
// Reset Password => /api/v1/password/reset/:token
// ----------------------------------------------
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Hash URL token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    const errorMessage = "Reset password url is invalid or has been expired";
    return next(new ErrorHandler(errorMessage, httpStatus.NOT_FOUND));
  }
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (password !== confirmPassword) {
    const errorMessage = "Password does not match";
    return next(new ErrorHandler(errorMessage, httpStatus.BAD_REQUEST));
  }
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user, httpStatus.OK, res);
});
