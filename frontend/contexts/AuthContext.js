import { auth } from '../firebaseConfig.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);    
};

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loginError, setLoginError] = useState(false);
  const [resetError, setResetError] = useState(false);
  
  // Login function that validates the provided username and password.
  const login = async (email, password) => {
    try {
      setLoginError(false);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (error) {
      setLoginError(true);
    }
  };

  // Logout function to clear user data and redirect to the login page.
  const logout = async () => {
    await auth.signOut();
    setUser(null);
  };

  // Register function
  const register = async (email, password) => {
    try {
      setLoginError(false);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (error) {
      setLoginError(true);
    }
  };


  const remember = async () => {
    try {
      setLoginError(false);
      await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    } catch (error) {
      setLoginError(true);
    }
  }

  const resetPassword = async (email) => {
    try {
      setResetError(false);
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      setResetError(true);
    }
  }

  // An object containing our state and functions related to authentication.
  // By using this context, child components can easily access and use these without prop drilling.
  const contextValue = {
    user, 
    loginError,
    resetError,
    login, 
    logout,
    register,
    remember,
    resetPassword,
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
// const token = user.accessToken;
// const email = user.email;
// const photoURL = user.photoURL;
// const emailVerified = user.emailVerified;
// const uid = user.uid;