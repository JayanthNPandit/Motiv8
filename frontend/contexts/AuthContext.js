import { auth } from '../firebaseConfig.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);    
};

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loginError, setLoginError] = useState(null);
  
  // Login function that validates the provided username and password.
  const login = (email, password) => {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          setUser(userCredential.user);
          // this method of retrieving access token also works
          // console.log(userCredential.user.accessToken)
        })
        .catch((error) => {
          setLoginError(error.message);
        });
    };

  // Logout function to clear user data and redirect to the login page.
  const logout = () => {
      auth.signOut().then(() => {
        setUser(null);
      });
  };

  // Register function
  const register = (email, password) => {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          setUser(userCredential.user);
          // correct and formal way of getting access token
          // userCredential.user.getIdToken().then((accessToken) => {
          //     console.log(accessToken)
          // })
        })
        .catch((error) => {
          setLoginError(error.message);
        });
  };

  // An object containing our state and functions related to authentication.
  // By using this context, child components can easily access and use these without prop drilling.
  const contextValue = {
      user, 
      loginError,
      login, 
      logout,
      register
  };

  // The AuthProvider component uses the AuthContext.Provider to wrap its children.
  // This makes the contextValue available to all children and grandchildren.
  // Instead of manually passing down data and functions, components inside this provider can
  // simply use the useAuth() hook to access anything they need.
  return (
      <AuthContext.Provider value={contextValue}>
          {children}
      </AuthContext.Provider>
  );
}

// signOut(auth)

// const user = auth.currentUser;
// const displayName = user.displayName;
// const email = user.email;
// const photoURL = user.photoURL;
// const emailVerified = user.emailVerified;
// const uid = user.uid;