const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      address: {
        type: String,
        requiered: true,
      },
      city: {
        type: String,
        requiered: true,
      },
      phoneNo: {
        type: String,
        requiered: true,
      },
      postalCode: {
        type: String,
        requiered: true,
      },
      country: {
        type: String,
        requiered: true,
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      requiered: true,
      ref: "User",
    },
    orderItems: [
      {
        name: {
          type: String,
          requiered: true,
        },
        quantity: {
          type: Number,
          requiered: true,
        },
        image: {
          type: String,
          requiered: true,
        },
        price: {
          type: Number,
          requiered: true,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          requiered: true,
          ref: "Product",
        },
      },
    ],
    paymentInfo: {
      id: {
        type: String,
      },
      status: {
        type: String,
      },
    },
    paidAt: {
      type: Date,
    },
    itemsPrice: {
      type: Number,
      requiered: true,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      requiered: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      requiered: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      requiered: true,
      default: 0.0,
    },
    orderStatus: {
      type: String,
      requiered: true,
      default: "Processing",
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const order = mongoose.model("Order", orderSchema);
module.exports = order;
