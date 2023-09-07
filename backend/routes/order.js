const express = require("express");
const router = express.Router();
const {
  newOrder,
  myOrders,
  getSingleOrder,
  allOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.route("/order/new").post([isAuthenticatedUser], newOrder);
router.route("/order/:id").get(getSingleOrder);
router.route("/orders/me").get([isAuthenticatedUser], myOrders);

// Admin routes
router
  .route("/admin/orders")
  .get([isAuthenticatedUser, authorizeRoles("admin")], allOrders);

router
  .route("/admin/order/:id")
  .put([isAuthenticatedUser, authorizeRoles("admin")], updateOrder)
  .delete([isAuthenticatedUser, authorizeRoles("admin")], deleteOrder);

module.exports = router;