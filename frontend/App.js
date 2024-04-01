import React, { useState, useEffect } from "react";

import UploadPhotoScreen from "./screens/UploadPhotoScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SignUpScreen from "./screens/SignUpScreen";
import LoginScreen from "./screens/LoginScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import GroupsScreen from "./screens/GroupsScreen";
import CreateGroupScreen from "./screens/CreateGroupScreen";
import JoinGroupScreen from "./screens/JoinGroupScreen";
import ConfirmGroupScreen from "./screens/ConfirmGroupScreen";
import GroupCodeScreen from "./screens/GroupCodeScreen";
import AddGoalScreen from "./screens/AddGoalScreen";
import GoalsScreen from "./screens/GoalsScreen";
import AddLongTermGoalScreen from "./screens/AddLongTermGoalScreen";
import AddRecurringGoalScreen from "./screens/AddRecurringGoalScreen";
import TakePhotoScreen from "./screens/TakePhotoScreen";

import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";
import { Image } from "react-native";
import home from "./assets/home.png";
import goal from "./assets/goal.png";
import post from "./assets/post.png";
import group from "./assets/group.png";
import profile from "./assets/user.png";

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


const Stack = createNativeStackNavigator();
//const Tab = createBottomTabNavigator();

import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";

// Prevent native splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

async function loadFonts() {
  await Font.loadAsync({
    "Poppins-Black": require("./assets/fonts/Poppins-Black.ttf"),
    "Poppins-BlackItalic": require("./assets/fonts/Poppins-BlackItalic.ttf"),
    "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
    "Poppins-BoldItalic": require("./assets/fonts/Poppins-BoldItalic.ttf"),
    "Poppins-ExtraBold": require("./assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraBoldItalic": require("./assets/fonts/Poppins-ExtraBoldItalic.ttf"),
    "Poppins-ExtraLight": require("./assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-ExtraLightItalic": require("./assets/fonts/Poppins-ExtraLightItalic.ttf"),
    "Poppins-Italic": require("./assets/fonts/Poppins-Italic.ttf"),
    "Poppins-Light": require("./assets/fonts/Poppins-Light.ttf"),
    "Poppins-LightItalic": require("./assets/fonts/Poppins-LightItalic.ttf"),
    "Poppins-Medium": require("./assets/fonts/Poppins-Medium.ttf"),
    "Poppins-MediumItalic": require("./assets/fonts/Poppins-MediumItalic.ttf"),
    "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("./assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-SemiBoldItalic": require("./assets/fonts/Poppins-SemiBoldItalic.ttf"),
    "Poppins-Thin": require("./assets/fonts/Poppins-Thin.ttf"),
    "Poppins-ThinItalic": require("./assets/fonts/Poppins-ThinItalic.ttf"),
  });
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await loadFonts();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      // Hide the splash screen once the app is done loading
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null; // what is displayed while the app is loading. could be a loading symbol or a screen, up to y'all
  }

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
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Groups"
          component={GroupsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateGroup"
          component={CreateGroupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="JoinGroup"
          component={JoinGroupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ConfirmGroup"
          component={ConfirmGroupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GroupCode"
          component={GroupCodeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Feed"
          component={UploadPhotoScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    */

    // only show the goals screen for now

    <NavigationContainer>
    <Stack.Navigator initialRouteName="TakePhoto">
      <Stack.Screen name="Goals" component={GoalsScreen} options={{headerShown: false}} />
      <Stack.Screen name="AddGoal" component={AddGoalScreen} options={{headerShown: false}} />
      <Stack.Screen name="AddRecurringGoal" component={AddRecurringGoalScreen} options={{headerShown: false}} />
      <Stack.Screen name="AddLongTermGoal" component={AddLongTermGoalScreen} options={{headerShown: false}} />
      <Stack.Screen name="TakePhoto" component={TakePhotoScreen} options={{headerShown: false}} />
    </Stack.Navigator>
  </NavigationContainer>

  /*
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
    */
  );
}
