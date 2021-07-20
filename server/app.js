const express = require("express");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const productRouter = require("./routes/productRouter");

// Start express app
const app = express();

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

//ROUTES
app.use("/api/products", productRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`), 404);
});

app.use(globalErrorHandler);

module.exports = app;
