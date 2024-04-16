import React, { useState, useEffect } from "react";

import UploadPhotoScreen from "./screens/UploadPhotoScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SettingsScreen from "./screens/SettingsScreen";
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
import MyGroupScreen from "./screens/MyGroupScreen";
import AddGoalScreen from "./screens/AddGoalScreen";
import GoalsScreen from "./screens/GoalsScreen";
import AddLongTermGoalScreen from "./screens/AddLongTermGoalScreen";
import AddRecurringGoalScreen from "./screens/AddRecurringGoalScreen";
import ConfirmPhotoScreen from "./screens/ConfirmPhotoScreen";
import EditGoalScreen from "./screens/EditGoalScreen";
import SharePhotoScreen from "./screens/SharePhotoScreen";
import SnapProgressScreen from "./screens/SnapProgressScreen";
import GalleryScreen from "./screens/GalleryScreen";
import FeedScreen from "./screens/FeedScreen";

import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";
import { fetchUserData } from "./backendFunctions";
import { Image } from "react-native";
import home from "./assets/home.png";
import purpleHome from "./assets/purple_home.png";
import goal from "./assets/goal.png";
import purpleGoal from "./assets/purple_goal.png";
import post from "./assets/post.png";
import purplePost from "./assets/purple_post.png";
import group from "./assets/group.png";
import purpleGroup from "./assets/purple_group.png";
import profile from "./assets/user.png";
import purpleProfile from "./assets/purple_profile.png";

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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

function TabContent() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Feed') {
            return focused ? <Image source={purpleHome}/> : <Image source={home}/>
          } else if (route.name === 'GoalStack') {
            return focused ? <Image source={purpleGoal}/> : <Image source={goal}/>
          } else if (route.name === 'PhotoStack') {
            return focused ? <Image source={purplePost}/> : <Image source={post}/>
          } else if (route.name === 'GroupStack') {
            return focused ? <Image source={purpleGroup}/> : <Image source={group}/>
          } else {
            return focused ? <Image source={purpleProfile}/> : <Image source={profile}/>
          }
        },
        tabBarShowLabel: false,
        tabBarActiveBackgroundColor: 'white',
        tabBarInactiveBackgroundColor: 'white',
        tabBarActiveTintColor: 'white',
        tabBarStyle: {
          height: '11%',
          width: '100%',
        },
        tabBarItemStyle: {
          alignItems: 'center',
          justifyContent: 'center'
        }
      })}
    >
      <Tab.Screen name="Feed" component={FeedScreen} options={{headerShown: false}}/>
      <Tab.Screen name="GoalStack" component={GoalStack} options={{headerShown: false}}/>
      <Tab.Screen name="PhotoStack" component={PhotoStack} options={{headerShown: false}}/>
      <Tab.Screen name="GroupStack" component={GroupStack} options={{headerShown: false}}/>
      <Tab.Screen name="ProfileStack" component={ProfileStack} options={{headerShown: false}}/>
    </Tab.Navigator>
  );
}

function PhotoStack() {
  return (
    <Stack.Navigator initialRouteName="SnapProgress">
      <Stack.Screen name="SnapProgress" component={SnapProgressScreen} options={{headerShown: false}} />
      <Stack.Screen name="ConfirmPhoto" component={ConfirmPhotoScreen} options={{headerShown: false}} />
      <Stack.Screen name="SharePhoto" component={SharePhotoScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

function GroupStack() {

  const { user } = useAuth();
  const [initialRoute, setInitialRoute] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const data = await fetchUserData(user.uid);
        const result = data.groupID ? 'MyGroup' : 'Groups';
        return result;
      }
    };
    fetchData().then((result) => setInitialRoute(result));
  }, [user]);

  useEffect(() => {
    console.log("." + initialRoute + ".");
  }, [initialRoute])

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      <Stack.Screen name="MyGroup" component={MyGroupScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Groups" component={GroupsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CreateGroup" component={CreateGroupScreen} options={{ headerShown: false }} />
      <Stack.Screen name="JoinGroup" component={JoinGroupScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ConfirmGroup" component={ConfirmGroupScreen} options={{ headerShown: false }} />
      <Stack.Screen name="GroupCode" component={GroupCodeScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

function ProfileStack() {
  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen name="Profile" component={ProfileScreen} options={{headerShown: false}} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{headerShown: false}} />
      <Stack.Screen name="Gallery" component={GalleryScreen} options={{headerShown: false}} />
    </Stack.Navigator>
  )
}

function GoalStack() {
  return (
    <Stack.Navigator initialRouteName="Goals">
      <Stack.Screen name="Goals" component={GoalsScreen} options={{headerShown: false}} />
      <Stack.Screen name="AddGoal" component={AddGoalScreen} options={{headerShown: false}} />
      <Stack.Screen name="AddRecurringGoal" component={AddRecurringGoalScreen} options={{headerShown: false}} />
      <Stack.Screen name="AddLongTermGoal" component={AddLongTermGoalScreen} options={{headerShown: false}} />
      <Stack.Screen name="ConfirmPhoto" component={ConfirmPhotoScreen} options={{headerShown: false}} />
      <Stack.Screen name="EditGoal" component={EditGoalScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SharePhoto" component={SharePhotoScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

function AppContent() {
  const { user } = useAuth();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={!user ? "Welcome" : "Tab"}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Groups" component={GroupsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CreateGroup" component={CreateGroupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="JoinGroup" component={JoinGroupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ConfirmGroup" component={ConfirmGroupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="GroupCode" component={GroupCodeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Tab" component={TabContent} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
