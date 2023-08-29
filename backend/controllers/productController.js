const Product = require("../models/product");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ApiFeatures = require("../utils/ApiFeatures");

// ---------------------------------------------
// Create a new product => /api/v1/admin/product/new
// ---------------------------------------------
exports.newProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

// ---------------------------------------------
// Update a product => /api/v1/admin/product/:id
// ---------------------------------------------
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
});

// ---------------------------------------------
// Delete a product => /api/v1/admin/product/:id
// ---------------------------------------------
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

// ---------------------------------------------
// Get all products => /api/v1/products
// ---------------------------------------------
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
  const productCount = await Product.countDocuments();
  const ApiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const products = await ApiFeature.query;

  return res.json({
    success: true,
    productCount,
    count: products.length,
    products,
  });
});

// ---------------------------------------------
// Get single product details => /api/v1/product/:id
// ---------------------------------------------
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
});
