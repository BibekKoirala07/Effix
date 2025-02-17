"use strict";
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const app = express();
const { connectDB } = require("./helpers/db");
const path = require("path");

require("dotenv").config({
  path: "./config/config.env",
});

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const userRouter = require("./src/routes/user.route");
const serviceCategoryRouter = require("./src/routes/serviceCategory.route");
const serviceOrderRouter = require("./src/routes/serviceOrder.route");

const allowedDomains = ["http://localhost:3000", process.env.PROD_CLIENT_URL];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedDomains.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
    return res.status(200).json({});
  }
  next();
});
app.use("/uploads", express.static("uploads"));

app.use("/user", userRouter);
app.use("/serviceCategory", serviceCategoryRouter);
app.use("/serviceOrder", serviceOrderRouter);

app.get("/cancel", (req, res) => {
  return res.status(400).redirect("http://localhost:3000/paymentCancelled");
});

app.get("/favicon.ico", (req, res) => {
  return res.status(404).send();
});

app.use("/", (req, res) => {
  return res.status(404).json({ msg: "Error! Not Found" });
});

app.listen(process.env.PORT || 8000, async () => {
  await connectDB();
  console.log("Server is listening on port 8000");
});
