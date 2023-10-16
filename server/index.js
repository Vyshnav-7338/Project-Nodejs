const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");
const UserModel = require("./models/Users");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.static("public"));
mongoose.connect("mongodb://127.0.0.1:27017/RegisterForm");

//Passport Size Image Storage function
const storage = multer.diskStorage({
  destination: (req, file, cd) => {
    cd(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({
  storage: storage,
});
// Id Proof Front View Image Storage function
const storageFrontView = multer.diskStorage({
  destination: (req, file, cd) => {
    cd(null, "public/Id-Proof-Images/FrontView");
  },
  filename: (req, FrontView, cb) => {
    cb(
      null,
      FrontView.fieldname +
        "_" +
        Date.now() +
        path.extname(FrontView.originalname)
    );
  },
});
const uploadFrontView = multer({
  storage: storageFrontView,
});
// Id Proof Back View Image Storage function
const storageBackView = multer.diskStorage({
  destination: (req, file, cd) => {
    cd(null, "public/Id-Proof-Images/BackView");
  },
  filename: (req, BackView, cb) => {
    cb(
      null,
      BackView.fieldname +
        "_" +
        Date.now() +
        path.extname(BackView.originalname)
    );
  },
});
const uploadBackView = multer({
  storage: storageBackView,
});

//Create Cookies
const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json("The Token was not available");
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) return res.json("Wrong Token");
      next();
    });
  }
};

//Registion Form API
app.post(
  "/register",
  upload.single("file"),
  uploadFrontView.single("BackView"),
  uploadBackView.single("Backview"),
  (req, res) => {
    const { name, email, phone, gender, DOB, addressProof, password } =
      req.body;
    bcrypt
      .hash(password, 10)
      .then((hash) => {
        UserModel.create({
          name,
          email,
          phone,
          gender,
          DOB,
          addressProof,
          password: hash,
          image: req.file.filename,
          FrontView: req.FrontView.filename,
          BackView: req.BackView.filename,
        })
          .then((register) => res.json(register))
          .catch((err) => res.json(err));
      })
      .catch((err) => res.json(err.message));
  }
);

//Login Form Api
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  UserModel.findOne({ email: email })
    .then((user) => {
      if (user) {
        bcrypt.compare(password, user.password, (err, response) => {
          if (response) {
            const token = jwt.sign({ email: user.email }, "jwt-secret-key", {
              expiresIn: "1d",
            });
            res.cookie("token", token);
            res.json("Success");
          } else {
            res.json("the password is incorrect");
          }
        });
      } else {
        res.json("data not found");
      }
    })
    .catch((err) => res.json(err));
});

//Home Page API
app.get("/home", verifyUser, (req, res) => {
  return res.json("Success");
});

app.listen(3001, () => {
  console.log("Server is Running");
});
