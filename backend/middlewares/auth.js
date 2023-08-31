const jwt = require("jsonwebtoken");
const catchAsyncErrors = require("./catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/user");
const httpStatus = require("../utils/httpStatus");

//---------------------------------------------
// Checks if user is authenticated or not
//---------------------------------------------
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    const errorMessage = "Please log in to access this resource.";
    return next(new ErrorHandler(errorMessage, httpStatus.UNAUTHORIZED));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    const errorMessage = "Invalid or expired token. Please log in again.";
    return next(new ErrorHandler(errorMessage, httpStatus.UNAUTHORIZED));
  }
});
//---------------------------------------------
// Checks if user is admin or not
//---------------------------------------------
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (!roles.includes(userRole)) {
      const errorMessage = `Role: ${userRole} is not allowed to access this resource.`;
      return next(new ErrorHandler(errorMessage, httpStatus.FORBIDDEN));
    }
    next();
  };
};
