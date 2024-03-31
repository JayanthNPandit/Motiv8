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
import GroupCodeScreen from './screens/GroupCodeScreen';
import AddGoalScreen from './screens/AddGoalScreen';
import GoalsScreen from './screens/GoalsScreen';

import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";
import { Image } from 'react-native';
import home from './assets/home.png';
import goal from './assets/goal.png';
import post from './assets/post.png';
import group from './assets/group.png';
import profile from './assets/user.png';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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
     /*
     <NavigationContainer>
       <Stack.Navigator initialRouteName={!user ? "Welcome" : "Profile"}>
         <Stack.Screen name="Welcome" component={WelcomeScreen} options={{headerShown: false}}/>
         <Stack.Screen name="SignUp" component={SignUpScreen} options={{headerShown: false}}/>
         <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
         <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{headerShown: false}}/>
         <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{headerShown: false}}/>
         <Stack.Screen name="Groups" component={GroupsScreen} options={{headerShown: false}}/>
         <Stack.Screen name="CreateGroup" component={CreateGroupScreen} options={{headerShown: false}}/>
         <Stack.Screen name="JoinGroup" component={JoinGroupScreen} options={{headerShown: false}}/>
         <Stack.Screen name="ConfirmGroup" component={ConfirmGroupScreen} options={{headerShown: false}}/>
         <Stack.Screen name="GroupCode" component={GroupCodeScreen} options={{headerShown: false}}/>
         <Stack.Screen name="Feed" component={UploadPhotoScreen} options={{headerShown: false}}/>
         <Stack.Screen name="Profile" component={ProfileScreen} options={{headerShown: false}}/>
       </Stack.Navigator>
    </NavigationContainer>
    */

    // only show the goals screen for now
    

    // <NavigationContainer>
    //     <Stack.Screen name="Goals" component={GoalsScreen} options={{headerShown: false}}/>
    //     <Stack.Screen name="AddGoals" component={AddGoalScreen} options={{headerShown: false}}/>
    // </NavigationContainer>

  
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({ focused, color, size }) => {
            if (route.name === 'Welcome') {
              return <Image source={home}/>
            } else if (route.name === 'SignUp') {
              return <Image source={goal}/>
            } else if (route.name === 'Login') {
              return <Image source={post}/>
            } else if (route.name === 'ForgotPassword') {
              return <Image source={group}/>
            } else {
              return <Image source={profile}/>
            }
          },
          tabBarShowLabel: false,
          tabBarActiveBackgroundColor: 'white',
          tabBarInactiveBackgroundColor: 'white',
          tabBarActiveTintColor: 'white',
          tabBarStyle: {
            height: '11%',
            width: '100%',
            bottom: -10
          },
          tabBarItemStyle: {
            alignItems: 'center',
            justifyContent: 'flex-start'
          }
        })}
      >
        <Tab.Screen name="Welcome" component={WelcomeScreen} options={{headerShown: false}}/>
        <Tab.Screen name="SignUp" component={SignUpScreen} options={{headerShown: false}}/>
        <Tab.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
        <Tab.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{headerShown: false}}/>
        <Tab.Screen name="Groups" component={GroupsScreen} options={{headerShown: false}}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
