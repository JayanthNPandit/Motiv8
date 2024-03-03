import { initializeApp, firebase } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { firestore, getFirestore, doc, getDoc, getDocs, addDoc, setDoc, collection } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyArsEaBAvKiFx3ude4_ROkBY5Z3Nt4ZbKA",
    authDomain: "group-goals-b006d.firebaseapp.com",
    projectId: "group-goals-b006d",
    storageBucket: "group-goals-b006d.appspot.com",
    messagingSenderId: "995025574167",
    appId: "1:995025574167:web:1ee404f2e7c500d7f5bf52",
    measurementId: "G-XGQPZ1WJ6G"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

// getting all the images
const fetchGroupImages = async (groupID) => {
    try {

      const groupDoc = await doc(db, 'groups', groupID);
      const groupDocRef = await getDoc(groupDoc);
      const userIDs = await groupDocRef.data().users;
    
      const userImages = [];
      await Promise.all(userIDs.map(async (user) => {
        const imagesCollection = await collection(db, 'users', user, 'images');
        const imagesSnapshot = await getDocs(imagesCollection);
        const images = imagesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));
        userImages.push(...images);
      }));
    
      userImages.sort((a, b) => a.timestamp - b.timestamp);
    
      const images = userImages.map((image) => ({url: image.imageUrl, caption: image.caption}));
      return images;
    
    } catch (error) {
      console.error('Error fetching images:', error);
    }
}

// adding the image to the bucket
const addToBucket = async (imageUrl) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const name = `images/${new Date().toISOString()}`;
    const imageRef = ref(storage, name);

    try {
      await uploadBytes(imageRef, blob);
    } catch (e) {
      console.log(e);
      throw e;
    }
    
    const downloadUrl = await getDownloadURL(imageRef);
    return {downloadUrl, name};
};

// adding image to the database
const addImageToDatabase = async (userID, goalID, caption, name, url) => {
    try {
      console.log("in backend");
      // add image
      const data = {
        goalID: goalID,
        caption: caption,
        imageName: name,
        imageUrl: url,
        timestamp: new Date(),
      };
      console.log(data);
      const addedImage = await addDoc(collection(db, 'users', userID, 'images'), data);
    
      console.log("added image");
    
      // update goals
      const goalDoc = await doc(db, 'users', userID, 'goals', goalID);
      const goalRef = await getDoc(goalDoc);
      const images = goalRef.data().images;
      await setDoc(goalDoc, {images: [...images, addedImage.id]}, {name: goalRef.data().name}, {type: goalRef.data().type});
    
      console.log("updated goals");
    
    } catch (error) {
      console.error('Error adding image to database:', error);
    }
}

export {storage, fetchGroupImages, addImageToDatabase, addToBucket };
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
