import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

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
const db = getFirestore(app);

const auth = getAuth(app); // Initialize Firebase Authentication

async function getData(db)
{
  const data = collection(db, 'data'); // obviously this is an example but we can replace this when our data types are decided
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
  });
}

createUser(auth, email, password) // Another example
.then((userCredential) => 
{
  const user = userCredential.user

})
.catch((error) => 
{
  const errorCode = error.code;
  const errorMessage = error.message;
});

signIn(auth, email, password) // Another example
.then((userCredential) => 
{
  const user = userCredential.user
})
.catch((error) =>
{
  const errorCode = error.code;
  const errorMessage = error.message;
});