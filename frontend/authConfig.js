import { auth } from './firebaseConfig.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

const createUser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
        // Signed in : get token
        const user = userCredential.user;
        console.log(user);
        })
        .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        });
    };

const loginUser = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
        const user = userCredential.user;
        console.log(user.accessToken);
        })
        .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        });
    };

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

export { createUser, loginUser, validateUser }; 

// signOut(auth)

// const user = auth.currentUser;
// const displayName = user.displayName;
// const email = user.email;
// const photoURL = user.photoURL;
// const emailVerified = user.emailVerified;
// const uid = user.uid;