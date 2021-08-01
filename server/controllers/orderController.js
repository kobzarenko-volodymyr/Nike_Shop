const Order = require("../models/orderModel");

const catchAsync = require("./../utils/catchAsync");

exports.newOrder = catchAsync(async (req, res, next) => {
  const { shippingInfo, orderItems, itemsPrice } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    itemsPrice,
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    order,
  });
});
