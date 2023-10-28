const express = require("express");
const bodyParser = require("body-parser");
const myRouter = express.Router();
const UserModel = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
myRouter.use(bodyParser.json());

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

myRouter
  .route("/api/register")
  .post(
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
module.exports = myRouter;
