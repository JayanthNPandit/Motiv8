import { auth } from "../firebaseConfig.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  deleteUser
} from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchUserData } from "../backendFunctions.js";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Login function that validates the provided username and password.
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message }; // Return the error message
    }
  };

  // Logout function to clear user data and redirect to the login page.
  const logout = async () => {
    await auth.signOut();
    setUser(null);
  };

  const del = async () => {
    await deleteUser(user);
    setUser(null);
  }

  // Register function
  const register = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message }; // Return the error message
    }
  };

  const remember = async () => {
    try {
      await firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message }; // Return the error message
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message }; // Return the error message
    }
  };

  // An object containing our state and functions related to authentication.
  // By using this context, child components can easily access and use these without prop drilling.
  const contextValue = {
    user,
    login,
    logout,
    del,
    register,
    remember,
    resetPassword,
  };

  // The AuthProvider component uses the AuthContext.Provider to wrap its children.
  // This makes the contextValue available to all children and grandchildren.
  // Instead of manually passing down data and functions, components inside this provider can
  // simply use the useAuth() hook to access anything they need.
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
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
