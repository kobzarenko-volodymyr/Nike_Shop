const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  shippingInfo: {
    address: {
      type: String,
      required: [true, "Please, enter your address!"],
    },
    city: {
      type: String,
      required: [true, "Please, enter your city!"],
    },
    phone: {
      type: String,
      required: [true, "Please, enter your phone number!"],
    },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Order must belong to a User!"],
  },
  orderItems: [
    {
      name: {
        type: String,
        required: [true, "Order item must have a name!"],
      },
      quantity: {
        type: Number,
        min: 1,
        max: 50,
        required: [true, "Order item must have a quantity!"],
      },
      image: {
        type: String,
        required: [true, "Order item must have an image!"],
      },
      price: {
        type: Number,
        required: [true, "Order item must have an price!"],
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Order must belong to a Product!"],
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: [true, "Order must have a Total Price!"],
    default: 0.0,
  },
  orderStatus: {
    type: String,
    required: [true, "Order must have an Order Status!"],
    default: "Processing",
  },
  paid: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Order", orderSchema);
