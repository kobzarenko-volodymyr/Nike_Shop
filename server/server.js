const mongoose = require("mongoose");
require("dotenv").config();

//for sync errors
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION!!! Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful!"));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

//for async errors
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION!!! Shutting down...");
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});
