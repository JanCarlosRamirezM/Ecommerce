//  dotenv
const path = require("path");
if (process.env !== "PRODUCTION") {
  require("dotenv").config({ path: path.join(__dirname, "../.env") });
}
const Product = require("../models/product");
const productData = require("./data/productData");
const connectDataBase = require("../config/database");

const productsSeeder = async () => {
  try {
    await connectDataBase(process.env.DB_LOCAL_URI);
    await Product.deleteMany();
    console.log("Product are deleted");

    await Product.insertMany(productData);
    console.log("All Products are added");
    process.exit();
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};

module.exports = productsSeeder;
