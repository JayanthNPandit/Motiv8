import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
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
export {storage};
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
