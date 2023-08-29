const app = require("./app");
const path = require("path");
const connectDataBase = require("./config/database.JS");

//  dotenv
if (process.env !== "PRODUCTION") {
  require("dotenv").config({ path: path.join(__dirname, "./.env") });
}

// connect to database
connectDataBase(process.env.DB_LOCAL_URI);

// listen to port
app.listen(process.env.PORT, () => {
  console.log(
    `Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
});
