const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middlewares/errorMiddleware");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Importing Routes
const productRoutes = require("./routes/product");
const authRoutes = require("./routes/auth");

app.use("/api/v1", productRoutes);
app.use("/api/v1", authRoutes);

// Middleware for Error Handling
app.use(errorMiddleware);

module.exports = app;
