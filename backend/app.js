const express = require("express");
const app = express();

// Middleware
app.use(express.json());

// Importing Routes
const productRoutes = require("./routes/product");

app.use("/api/v1", productRoutes);

module.exports = app;
