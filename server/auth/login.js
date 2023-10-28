const express = require("express");
const bodyParser = require("body-parser");
const myRouter = express.Router();
const UserModel = require("../models/Users");

myRouter.use(bodyParser.json());
myRouter.route("/").post((req, res) => {
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
module.exports = myRouter;
