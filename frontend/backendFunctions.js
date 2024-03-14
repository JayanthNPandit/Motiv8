import { storage, auth, db } from './firebaseConfig.js';
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { doc, getDoc, getDocs, addDoc, setDoc, collection } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// authorize user
const validateUser = (token) => {
    return new Promise((resolve, reject) => {
        try {
          const tokenId = token.split("Bearer ")[1];
    
          verifyIdToken(auth, tokenId)
            .then((decoded) => {
              resolve(decoded);
            })
            .catch((err) => {
              console.error(err);
              reject(err);
            });
        } catch (e) {
          console.error("Error parsing token:", e);
          reject(e);
        }
    });
}

export const createUser = async (user, username, name, weight, pfp) => {
  try {
    const decodedUser = await validateUser(`Bearer ${user.accessToken}`);
    if (!decodedUser) throw error("not authorized");

    addToBucket(user, 'profiles', pfp)

    const userData = {
      name: name,
      username: username, 
      email: user.email,
      weight: weight,
      profilePicture: pfp,
      groupID: ''
    }

    await setDoc(doc(db, 'users', user.uid), userData);
    await addDoc(collection(db, 'users', user.uid, 'images', {}));
    await addDoc(collection(db, 'users', user.uid, 'goals', {}));

  } catch (error) {
    console.error('Error creating user:', error);
  }
}

// getting all the images
export const fetchGroupImages = async (user, groupID) => {
  try {

    const decodedUser = await validateUser(`Bearer ${user.accessToken}`);
    if (!decodedUser) throw error("not authorized");
  
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
  
    userImages.sort((a, b) => b.timestamp - a.timestamp);
  
    const images = userImages.map((image) => ({url: image.imageUrl, caption: image.caption}));
    return images;
  
  } catch (error) {
    console.error('Error fetching images:', error);
  }
}

// getting the 'limit' number of recent images
export const fetchRecentGroupImages = async (user, groupID, limit) => {
  try {
    
    // authorize user
    const decodedUser = await validateUser(`Bearer ${user.accessToken}`);
    if (!decodedUser) throw error("not authorized");

    const groupDoc = await doc(db, 'groups', groupID);
    const groupDocRef = await getDoc(groupDoc);
    const userIDs = await groupDocRef.data().users;
  
    const userImages = [];
    await Promise.all(userIDs.map(async (user) => {
      const imagesCollection = await collection(db, 'users', user, 'images');
      const query = await getDocs(query(imagesCollection, query => orderBy(query, 'timestamp', 'desc'), limit(limit)));
      const imagesSnapshot = await getDocs(query);
      const images = imagesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
      }));
      userImages.push(...images);
    }));
  
    userImages.sort((a, b) => b.timestamp - a.timestamp);
  
    const images = userImages.map((image) => ({url: image.imageUrl, caption: image.caption}));
    return images.slice(0, limit);
  
  } catch (error) {
    console.error('Error fetching images:', error);
  }
}

// get a specific user's images
export const fetchUserImages = async (user) => {
  try {

    const decodedUser = await validateUser(`Bearer ${user.accessToken}`);
    if (!decodedUser) throw error("not authorized");

    const userID = user.uid;

    const imagesCollection = await collection(db, 'users', userID, 'images');
    const imagesSnapshot = await getDocs(imagesCollection);
    const images = imagesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    }));
    return images;
  } catch (error) {
    console.error('Error fetching images:', error);
  }
}

// adding the image to the bucket
export const addToBucket = async (user, directory, imageUrl) => {

  const decodedUser = await validateUser(`Bearer ${user.accessToken}`);
  if (!decodedUser) throw error("not authorized");

  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const name = `${directory}/${new Date().toISOString()}`;
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
export const addImageToDatabase = async (user, goalID, caption, name, url) => {
  try {

    const decodedUser = await validateUser(`Bearer ${user.accessToken}`);
    if (!decodedUser) throw error("not authorized");

    const userID = user.uid;
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