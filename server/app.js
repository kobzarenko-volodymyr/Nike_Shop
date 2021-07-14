const express = require("express");

const productRouter = require("./routes/productRouter");

// Start express app
const app = express();

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

//ROUTES
app.use("/api/products", productRouter);

module.exports = app;
