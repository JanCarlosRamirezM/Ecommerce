const Product = require("../models/product");

// ---------------------------------------------
// Create a new product => /api/v1/admin/product/new
// ---------------------------------------------
exports.newProduct = async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
};

// ---------------------------------------------
// Update a product => /api/v1/admin/product/:id
// ---------------------------------------------
exports.updateProduct = async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  if (!product) {
    // return next(new ErrorHandler("Product not found", 404));
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }
  res.status(200).json({
    success: true,
    product,
  });
};

// ---------------------------------------------
// Delete a product => /api/v1/admin/product/:id
// ---------------------------------------------
exports.deleteProduct = async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    // return next(new ErrorHandler("Product not found", 404));
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }
  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
};

// ---------------------------------------------
// Get all products => /api/v1/products
// ---------------------------------------------
exports.getProducts = async (req, res, next) => {
  const products = await Product.find({});
  return res.json({
    success: true,
    count: products.length,
    products,
  });
};

// ---------------------------------------------
// Get single product details => /api/v1/product/:id
// ---------------------------------------------
exports.getSingleProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    // return next(new ErrorHandler("Product not found", 404));
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }
  res.status(200).json({
    success: true,
    product,
  });
};
