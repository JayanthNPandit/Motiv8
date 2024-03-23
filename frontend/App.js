import React, { useState, useEffect } from 'react';

import UploadPhotoScreen from './screens/UploadPhotoScreen';
import ProfileScreen from './screens/ProfileScreen';
import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import GroupsScreen from './screens/GroupsScreen';
import CreateGroupScreen from './screens/CreateGroupScreen';
import JoinGroupScreen from './screens/JoinGroupScreen';
import ConfirmGroupScreen from './screens/ConfirmGroupScreen';

import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user } = useAuth(); 
  return (
    // <NavigationContainer>
    //   <Stack.Navigator initialRouteName={!user ? "Welcome" : "Profile"}>
    //     <Stack.Screen name="Welcome" component={WelcomeScreen} options={{headerShown: false}}/>
    //     <Stack.Screen name="SignUp" component={SignUpScreen} options={{headerShown: false}}/>
    //     <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
    //     <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{headerShown: false}}/>
    //     <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{headerShown: false}}/>
    //     <Stack.Screen name="Groups" component={GroupsScreen} options={{headerShown: false}}/>
    //     <Stack.Screen name="CreateGroup" component={CreateGroupScreen} options={{headerShown: false}}/>
    //     <Stack.Screen name="JoinGroup" component={JoinGroupScreen} options={{headerShown: false}}/>
    //     <Stack.Screen name="ConfirmGroup" component={ConfirmGroupScreen} options={{headerShown: false}}/>
    //     <Stack.Screen name="Feed" component={UploadPhotoScreen} options={{headerShown: false}}/>
    //     <Stack.Screen name="Profile" component={ProfileScreen} options={{headerShown: false}}/>
    //   </Stack.Navigator>
    // </NavigationContainer>

    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Groups" component={GroupsScreen} options={{headerShown: false}}/>
        <Stack.Screen name="CreateGroup" component={CreateGroupScreen} options={{headerShown: false}}/>
        <Stack.Screen name="JoinGroup" component={JoinGroupScreen} options={{headerShown: false}}/>
        <Stack.Screen name="ConfirmGroup" component={ConfirmGroupScreen} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
