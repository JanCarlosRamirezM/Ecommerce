const ErrorHandler = require("../utils/ErrorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "DEVELOPMENT") {
    return res.status(err.statusCode).json({
      success: false,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  if (process.env.NODE_ENV === "PRODUCTION") {
    let error = { ...err };
    error.message = err.message;

    switch (err.name) {
      case "CastError":
        error.message = `Resource not found. Invalid: ${err.path}`;
        break;
      case "ValidationError":
        error.message = Object.values(err.errors).map((value) => value.message);
        break;
      case "JsonWebTokenError":
        error.message = "Json Web Token is invalid. Try again!";
        break;
      case "TokenExpiredError":
        error.message = "Json Web Token has expired. Try again!";
        break;
    }

    if (err.code === 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
      error = new ErrorHandler(message, 400);
    }

    res.status(error.statusCode).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
