import { storage, auth, db } from "./firebaseConfig.js";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import {
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
} from "firebase/firestore";
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
};

// get a user when passed in an id
export const getUser = async (userID) => {
  try {
    const userDoc = await doc(db, "users", userID);
    const userDocRef = await getDoc(userDoc);
    return userDocRef.data();
  } catch (error) {
    console.error("Error getting user:", error);
  }
}

// add a goal to the user and checks if the user does not have a goals collection and calls createGoalsCollection if so
export const addGoal = async (user, goalName, type, frequency, counter, date, description) => {
  try {
    const userID = user.uid;
    console.log(userID);
    const goalData = {
      name: goalName,
      type: type,
      frequency: frequency,
      counter: counter,
      currentCounter: counter,
      date: date,
      description: description,
      images: [],
      completed: false,
    };

    // if user does not have a goals collection
    if (user.goals === undefined) {
      console.log("creating goals collection");
      await createGoalsCollection(user);
    }

    const goalDocRef = collection(db, "users", userID, "goals");
    await addDoc(goalDocRef, goalData);
    console.log("added goal" + goalData.name);
  } catch (error) {
    console.error("Error adding goal:", error);
  }
};

// create a goals collection for a certain user
export const createGoalsCollection = async (user) => {
  try {
    const userID = user.uid;
    const goalsCollection = collection(db, "users", userID, "goals");
    //await addDoc(goalsCollection, {name: 'default', type: 'default', frequency: 'default', description: 'default', images: []});
  } catch (error) {
    console.error("Error creating goals collection:", error);
  }
};

// return the goals collection for a specific user
export const fetchUserGoals = async (user) => {
  try {
    const userID = user.uid;

    const goalsCollection = await collection(db, "users", userID, "goals");

    const goalsSnapshot = await getDocs(goalsCollection);

    try {
      const goals = goalsSnapshot.docs.map((doc) => doc.data());
      return goals;
    } catch (error) {
      console.error("Error with the mapping:", error);
    }
  } catch (error) {
    console.error("Error fetching goals:", error);
  }
};

export const createUser = async (user, username, name, pfp) => {
  try {
    // const decodedUser = await validateUser(user.accessToken);
    // if (!decodedUser) throw error("not authorized");
    let url = "";
    if (pfp) {
      const { downloadUrl } = await addToBucket(user, "profiles", pfp);
      url = downloadUrl;
    }

    const userData = {
      name: name,
      username: username,
      email: user.email,
      profilePicture: url,
      groupID: "",
    };

    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, userData);
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

export const changeUserData = async (user, name, username, imageUrl) => {
  try {
    let url = "";
    if (imageUrl) {
      const { downloadUrl } = await addToBucket(user, "profiles", imageUrl);
      url = downloadUrl;
    }
    const updatedFields = {
      name: name,
      username: username,
      profilePicture: url,
    };
    await updateDoc(doc(db, "users", user.uid), updatedFields);
  } catch (error) {
    console.log("Error changing user data:", error);
  }
};

export const delUser = async (user) => {
  try {
    const userDocRef = doc(db, "users", user.uid);
    await deleteDoc(userDocRef);
  } catch (error) {
    console.log("Error deleting user data:", error);
  }
};

export const fetchUserData = async (userID) => {
  try {
    const response = await getDoc(doc(db, "users", userID));
    if (response.exists()) {
      return response.data();
    } else throw error("User does not exist");
  } catch (error) {
    console.log("Error fetching users data:", error);
  }
};

export const fetchGroupData = async (groupID) => {
  try {
    const response = await getDoc(doc(db, "groups", groupID));
    if (response.exists()) return response.data();
    else throw error("Group does not exist");
  } catch (error) {
    console.log("Error fetching group data:", error);
  }
};

export const createGroup = async (user, groupName) => {
  try {
    const groupData = {
      name: groupName,
      users: [user.uid],
    };
    const groupDocRef = collection(db, "groups");
    const response = await addDoc(groupDocRef, groupData);
    const id = response.id;
    const updatedUser = { groupID: id };
    await updateDoc(doc(db, "users", user.uid), updatedUser);
    return id;
  } catch (error) {
    console.log("Error creating group:", error);
  }
};

export const joinGroup = async (user, groupData, groupID) => {
  try {
    const updatedFields = { users: [...groupData.users, user.uid] };
    await updateDoc(doc(db, "groups", groupID), updatedFields);
    // update user
    const updatedUser = { groupID: groupID };
    await updateDoc(doc(db, "users", user.uid), updatedUser);
  } catch (error) {
    console.log("Error joining group:", error);
  }
};

export const deleteGroup = async (user, groupID) => {
  try {
    await deleteDoc(doc(db, "groups", groupID));
    const updatedUser = { groupID: "" };
    await updateDoc(doc(db, "users", user.uid), updatedUser);
  } catch (error) {
    console.log("Error deleting group:", error);
  }
};

export const leaveGroup = async (user, groupID, groupData) => {
  try {
    let users = groupData.users;
    users = users.filter((element) => element !== user.uid);
    if (users.length == 0) {
      deleteDoc(doc(db, "groups", groupID));
    } else {
      const updatedData = { users: users };
      await updateDoc(doc(db, "groups", groupID), updatedData);
    }
    const updatedUser = { groupID: "" };
    await updateDoc(doc(db, "users", user.uid), updatedUser);
  } catch (error) {
    console.log("Error leaving group:", error);
  }
};

// getting all the images
export const fetchGroupImages = async (user, groupID) => {
  try {
    const groupDoc = await doc(db, "groups", groupID);
    const groupDocRef = await getDoc(groupDoc);
    const userIDs = await groupDocRef.data().users;

    const userImages = [];
    await Promise.all(
      userIDs.map(async (user) => {
        const imagesCollection = await collection(db, "users", user, "images");
        const imagesSnapshot = await getDocs(imagesCollection);
        const images = imagesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        userImages.push(...images);
      })
    );

    userImages.sort((a, b) => b.timestamp - a.timestamp);

    const images = userImages.map((image) => ({
      url: image.imageUrl,
      caption: image.caption,
    }));
    return images;
  } catch (error) {
    console.error("Error fetching images:", error);
  }
};

// getting the 'limit' number of recent images
export const fetchRecentGroupImages = async (user, groupID, limit) => {
  try {
    const groupDoc = await doc(db, "groups", groupID);
    const groupDocRef = await getDoc(groupDoc);
    const userIDs = await groupDocRef.data().users;

    const userImages = [];
    await Promise.all(
      userIDs.map(async (user) => {
        const imagesCollection = await collection(db, "users", user, "images");
        const query = await getDocs(
          query(
            imagesCollection,
            (query) => orderBy(query, "timestamp", "desc"),
            limit(limit)
          )
        );
        const imagesSnapshot = await getDocs(query);
        const images = imagesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        userImages.push(...images);
      })
    );

    userImages.sort((a, b) => b.timestamp - a.timestamp);

    const images = userImages.map((image) => ({
      url: image.imageUrl,
      caption: image.caption,
    }));
    return images.slice(0, limit);
  } catch (error) {
    console.error("Error fetching images:", error);
  }
};

// get a specific user's images
export const fetchUserImages = async (user) => {
  try {
    const userID = user.uid;

    const imagesCollection = await collection(db, "users", userID, "images");
    const imagesSnapshot = await getDocs(imagesCollection);
    const images = imagesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return images;
  } catch (error) {
    console.error("Error fetching images:", error);
  }
};

// adding the image to the bucket
export const addToBucket = async (user, directory, imageUrl) => {
  console.log("adding to bucket");
  const response = await fetch(imageUrl);
  console.log("fetched image")
  const blob = await response.blob();
  console.log("blobbed image")
  const name = `${directory}/${new Date().toISOString()}`;
  console.log("name: " + name);
  const imageRef = ref(storage, name);
  console.log("image ref: " + imageRef);

  try {
    await uploadBytes(imageRef, blob);
  } catch (e) {
    console.log(e);
    throw e;
  }

  const downloadUrl = await getDownloadURL(imageRef);
  return { downloadUrl, name };
};

// adding image to the database
export const addImageToDatabase = async (user, goals, caption, url) => {
  const userID = user.uid;
  // add image
  const data = {
    goals: goals,
    caption: caption,
    imageUrl: url,
    timestamp: new Date(),
    likes: []
    // add list of people who liked the image
  };
  console.log(data);
  const addedImage = await addDoc(
    collection(db, "users", userID, "images"),
    data
  );

  console.log("added image");

  return addedImage.id;

  // fix the editing goals part later
};
