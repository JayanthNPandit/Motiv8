import React, { useState, useEffect } from "react";
import { Camera } from "expo-camera";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { textStyles, containerStyles } from "../styles/styles";
import image from "../assets/working-out.png";

const WelcomeScreen = ({ navigation }) => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  useEffect(() => {
    const checkCameraPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === "granted");
      if (status !== "granted") {
        Alert.alert("We need camera permissions for this app to work", "", [
          {
            text: "Ok",
            onPress: {checkCameraPermission}, // Prompt again if denied
          },
        ]);
      }
    };
    checkCameraPermission();
  }, []);

  return (
    <View style={containerStyles.background}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={textStyles.title}>Motiv8.</Text>
          <Text style={{ ...textStyles.textBodyGray, textAlign: "left" }}>
            Workout with friends to reach your goals!
          </Text>
        </View>
        <Image style={styles.image} source={image} />
        <TouchableOpacity
          style={{ ...containerStyles.longPurpleButton, marginBottom: "2%" }}
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text style={textStyles.textBodyHeaderWhite}> Signup </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={containerStyles.longWhiteButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={textStyles.textBodyHeaderPurple}> Login </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "white",
    marginTop: '15%',
    marginBottom: "20%",
    backgroundColor: "white",
  },
  // HEADER STYLING
  headerContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 5,
    marginHorizontal: "9%",
    marginVertical: "5%",
  },
  // IMAGE STYLING
  image: {
    width: "97%",
    height: "30%",
    marginBottom: '8%'
  },
});

export default WelcomeScreen;
