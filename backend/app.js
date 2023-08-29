const express = require("express");
const app = express();
const errorMiddleware = require("./middlewares/errorMiddleware");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Importing Routes
const productRoutes = require("./routes/product");

app.use("/api/v1", productRoutes);

// Middleware for Error Handling 
app.use(errorMiddleware);

module.exports = app;
