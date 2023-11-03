const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();
const port = 7000
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const fileUpload = require('express-fileupload');
app.use(fileUpload());

const handleErrors = require('./middlewares/HandleError');
app.use(handleErrors)

app.use(express.static("public"));
mongoose.connect(
  "mongodb+srv://hibi:hibi@cluster0.x4b5gwa.mongodb.net/User?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

//Registion Form API

const regroute = require("./auth/register");
app.use("/", regroute);

//Login Form Api
const loginroute = require("./auth/login");
app.use("/api/login", loginroute);
//Home Page API

app.listen(port, () => console.log(`hibi app listening at http://localhost:${port}`))
process.env["NTBA_FIX_350"] = 1;
