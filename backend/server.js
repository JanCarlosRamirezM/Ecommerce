const app = require("./app");
const path = require("path");
const connectDataBase = require("./config/database.JS");
const cloudinary = require("cloudinary");

// Handling Uncaught Exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.stack}`);
  console.log(`Shutting down due to uncaught exceptions`);
  process.exit(1);
});

//  dotenv
if (process.env !== "PRODUCTION") {
  require("dotenv").config({ path: path.join(__dirname, "./.env") });
}

// connect to database
connectDataBase(process.env.DB_LOCAL_URI);

// Configuring cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// listen to port
const server = app.listen(process.env.PORT, () => {
  console.log(
    `App listening on port: ${process.env.PORT} In ${process.env.NODE_ENV} mode.`
  );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err.stack}`);
  console.log(`Shutting down the server due to unhandled promise rejection `);
  server.close(() => {
    process.exit(1);
  });
});
