const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
bodyParser = require("body-parser");
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static("public"));
mongoose.connect("mongodb://127.0.0.1:27017/RegisterForm");

//Registion Form API

const regroute = require("./auth/register");
app.use("/", regroute);

//Login Form Api
const loginroute = require("./auth/login");
app.use("/api/login", loginroute);
//Home Page API

app.listen(3001, () => {
  console.log("Server is Running");
});
