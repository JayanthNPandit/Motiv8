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

app.post('/addImageToDatabase', async (req, res) => {
  try {
    console.log("in backend");
    // add image
    const data = {
      'goalID': req.body.goalID,
      'caption': req.body.caption,
      'imageName': req.body.name,
      'imageUrl': req.body.imageUrl,
      'timestamp': req.body.timestamp,
    }
    console.log(data);
    const userID = req.body.userID;
    const addedImage = await db.collection('users').doc(userID).collection('images').add(data);

    console.log("added image");

    // update goals
    const goalDoc = await db.collection('users').doc(userID).collection('goals').doc(req.body.goalID);
    const goalSnapshot = await goalDoc.get();
    const {images} = goalSnapshot.data();
    await goalDoc.update({'images': [...images, addedImage.id]});

    console.log("updated goals");

    res.json({ success: true, message: 'Image added to database successfully' });
  } catch (error) {
    console.error('Error adding image to Firestore:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});