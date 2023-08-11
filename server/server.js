const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const routes = require("./routes");
const User = require("./models/user.model");

require("dotenv").config({ path: path.join(__dirname, "../.env") });

// Applying middleware
// enable cors
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.use("/", express.json());

app.use("/employee", routes.EmployeeRouter);
app.use("/hr", routes.HrRouter);

// Catch-all for unsupported paths
app.all("*", (req, res) => {
  console.log({
    error: "InvalidURI",
    description: `The URI ${req.url} is not valid.`,
  });
  res.status(404).render("home");
});

module.exports = app;
