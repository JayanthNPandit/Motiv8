import UploadPhotoScreen from './components/UploadPhotoScreen';
import ProfileScreen from './components/ProfileScreen';
import LoginScreen from './components/LoginScreen';

import { AuthProvider } from "./contexts/AuthContext";

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
          <Stack.Screen name="Feed" component={UploadPhotoScreen} options={{headerShown: false}}/>
          <Stack.Screen name="Profile" component={ProfileScreen} options={{headerShown: false}}/>
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
}
