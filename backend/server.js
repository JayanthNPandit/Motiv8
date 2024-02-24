require("dotenv").config();

const express = require("express");
const admin = require("firebase-admin");
const firebase = require("./firebase");
const { db, bucket } = require("./firebase");

const app = express();

const cors = require("cors");
const bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.json());

const auth = (req, res, next) => {
  try {
    const tokenId = req.get("Authorization").split("Bearer ")[1];
    return admin
      .auth()
      .verifyIdToken(tokenId)
      .then((decoded) => {
        req.token = decoded;
        next();
      })
      .catch((err) => res.status(401).send(err));
  } catch (e) {
    res.status(400).send("Errors");
  }
};

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});