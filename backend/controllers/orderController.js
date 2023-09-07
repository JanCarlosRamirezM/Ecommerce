const Order = require("../models/order");
const Product = require("../models/product");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ApiFeatures = require("../utils/ApiFeatures");
const httpStatus = require("../utils/httpStatus");

//-------------------------------------
//  Create a new order => /api/v1/order/new
//-------------------------------------
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
  } = req.body;

  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
    paidAt: Date.now(),
    user: req.user._id,
  });
  res.status(httpStatus.CREATED).json({
    success: true,
    order,
  });
});

//---------------------------------------
//  Get logged in user orders => /api/v1/orders/me
//---------------------------------------
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(httpStatus.OK).json({
    success: true,
    orders,
  });
});

//---------------------------------------
//  Get order details => /api/v1/order/:id
//---------------------------------------
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(new ErrorHandler("Order not found", httpStatus.NOT_FOUND));
  }
  res.status(httpStatus.OK).json({
    success: true,
    order,
  });
});

//---------------------------------------
//  Get all orders => /api/v1/admin/orders
//---------------------------------------
exports.allOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();
  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });
  res.status(httpStatus.OK).json({
    success: true,
    totalAmount,
    orders,
  });
});

//---------------------------------------
//  Update order status => /api/v1/admin/order/:id
//---------------------------------------
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  const { orderStatus } = req.body;

  if (!order) {
    return next(new ErrorHandler("Order not found", httpStatus.NOT_FOUND));
  }
  if (order.orderStatus === "Delivered") {
    return next(
      new ErrorHandler(
        "You have already delivered this order",
        httpStatus.BAD_REQUEST
      )
    );
  }
  if (orderStatus === "Shipped") {
    order.orderItems.forEach(async (order) => {
      await updateStock(order.product, order.quantity);
    });
  }
  order.orderStatus = orderStatus;
  if (orderStatus === "Delivered") {
    order.deliveredAt = Date.now();
  }
  await order.save({ validateBeforeSave: false });
  res.status(httpStatus.OK).json({
    success: true,
  });
});

// Update stock
async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.stock = product.stock - quantity;
  await product.save({ validateBeforeSave: false });
}
//---------------------------------------
// Delete order => /api/v1/admin/order/:id
//---------------------------------------
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) {
    return next(new ErrorHandler("Order not found", httpStatus.NOT_FOUND));
  }

  res.status(httpStatus.OK).json({
    success: true,
    message: "Order deleted successfully",
  });
});
