import React, { useState, useEffect } from 'react';

import UploadPhotoScreen from './components/UploadPhotoScreen';
import ProfileScreen from './components/ProfileScreen';
import SignUpScreen from './components/SignUpScreen';
import LoginScreen from './components/LoginScreen';
import WelcomeScreen from './components/WelcomeScreen';
import OnboardingScreen from './components/OnboardingScreen';

import { AuthProvider } from "./contexts/AuthContext";

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen name="Welcome" component={WelcomeScreen} options={{headerShown: false}}/>
          <Stack.Screen name="SignUp" component={SignUpScreen} options={{headerShown: false}}/>
          <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{headerShown: false}}/>
          <Stack.Screen name="Feed" component={UploadPhotoScreen} options={{headerShown: false}}/>
          <Stack.Screen name="Profile" component={ProfileScreen} options={{headerShown: false}}/>
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
