const Product = require("../models/product");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ApiFeatures = require("../utils/ApiFeatures");
const httpStatus = require("../utils/httpStatus");

// ---------------------------------------------
// Create a new product => /api/v1/admin/product/new
// ---------------------------------------------
exports.newProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);

  res.status(httpStatus.CREATED).json({
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
    return next(new ErrorHandler("Product not found", httpStatus.NOT_FOUND));
  }
  res.status(httpStatus.OK).json({
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
    return next(new ErrorHandler("Product not found", httpStatus.NOT_FOUND));
  }
  res.status(httpStatus.OK).json({
    success: true,
    message: "Product deleted successfully",
  });
});

// ---------------------------------------------
// Get all products => /api/v1/products
// ---------------------------------------------
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
  const productsCount = await Product.countDocuments();
  
  const ApiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const products = await ApiFeature.query;
  let filteredProductCount = products.length;

  return res.status(httpStatus.OK).json({
    success: true,
    productsCount,
    filteredProductCount,
    products,
  });
});

// ---------------------------------------------
// Get single product details => /api/v1/product/:id
// ---------------------------------------------
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", httpStatus.NOT_FOUND));
  }
  res.status(httpStatus.OK).json({
    success: true,
    product,
  });
});

// ---------------------------------------------
// Create new review => /api/v1/review
// ---------------------------------------------
exports.newReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", httpStatus.NOT_FOUND));
  }

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.ratings = avg / product.reviews.length;
  await product.save({ validateBeforeSave: false });
  res.status(httpStatus.OK).json({
    success: true,
  });
});

// ---------------------------------------------
// Get all reviews => /api/v1/reviews
// ---------------------------------------------
exports.getReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", httpStatus.NOT_FOUND));
  }
  res.status(httpStatus.OK).json({
    success: true,
    reviews: product.reviews,
  });
});

// ---------------------------------------------
// Delete review => /api/v1/review
// ---------------------------------------------
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", httpStatus.NOT_FOUND));
  }
  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.reviewId.toString()
  );
  product.reviews = reviews;
  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.ratings = avg / product.reviews.length;
  await product.save({ validateBeforeSave: false });
  res.status(httpStatus.OK).json({
    success: true,
  });
});
