import { storage, auth, db } from './firebaseConfig.js';
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { doc, getDoc, getDocs, addDoc, setDoc, updateDoc, collection } from "firebase/firestore";
import { verifyIdToken } from "firebase/auth";

// authorize user
const validateUser = (token) => {
    return new Promise((resolve, reject) => {
        try {    
          verifyIdToken(token)
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

export const createUser = async (user, username, name, pfp) => {
  try {
    // const decodedUser = await validateUser(user.accessToken);
    // if (!decodedUser) throw error("not authorized");
    const {downloadUrl} = await addToBucket(user, 'profiles', pfp);
    const userData = {
      name: name,
      username: username, 
      email: user.email,
      profilePicture: downloadUrl,
      groupID: ''
    }

    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, userData);
    await addDoc(collection(userDocRef, 'images'), {});
    await addDoc(collection(userDocRef, 'goals'), {});

  } catch (error) {
    console.error('Error creating user:', error);
  }
}

export const changeUserData = async (user, name, username, imageUrl) => {
  try {
    const updatedFields = {
      name: name,
      username: username,
      profilePicture: imageUrl,
    }
    await updateDoc(doc(db, 'users', user.uid), updatedFields);
  } catch (error) {
    console.log('Error changing user data:', error);
  }
}

export const fetchUserData = async (user) => {
  try {
    const response = await getDoc(doc(db, 'users', user.uid));
    if (response.exists()) return response.data();
    else throw error("User does not exist");
  } catch (error) {
    console.log('Error fetching users data:', error);
  }
}

// getting all the images
export const fetchGroupImages = async (user, groupID) => {
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