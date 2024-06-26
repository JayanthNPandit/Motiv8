// a screen that allows the user to take a picture, add a caption, and select goals to apply to the image

import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext.js";
import {
  fetchGroupImages,
  fetchRecentGroupImages,
  addImageToDatabase,
  addToBucket,
} from "../backendFunctions.js";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  RefreshControl,
  Platform,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { ImageManipulator, manipulateAsync } from "expo-image-manipulator";
import { Camera } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import { containerStyles, textStyles } from "../styles/styles.js";
import { useRoute } from "@react-navigation/native";

import snapImage from "../assets/snappicture.png";
import galleryImage from "../assets/gallery.png";

import defaultImage from "../assets/graybox.png";

const ConfirmPhotoScreen = ({ navigation }) => {
  const route = useRoute();

  const { imageUrl } = route.params;
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [imageData, setImageData] = useState([]);
  const { user } = useAuth();

  // upload the image
  const confirmImage = async () => {
    navigation.navigate("SharePhoto", { imageUrl: imageUrl });
  };

  const tryAgain = () => {
    navigation.navigate("SnapProgress");
  };

  return (
    <View style={containerStyles.background}>
      <View style={containerStyles.container}>
        <View style={containerStyles.headerContainer}>
          <Text style={textStyles.header}>Looking Good!</Text>
        </View>
        <View style={containerStyles.imageContainer}>
          <Image style={styles.image} source={{ uri: imageUrl }} />
          {console.log("imageurl" + imageUrl)}
        </View>
        <View style={containerStyles.buttonContainer}>
          <TouchableOpacity
            style={{...containerStyles.whiteButton, paddingHorizontal: '10%'}}
            onPress={tryAgain}
          >
            <Text style={textStyles.textBodyHeaderPurple}>Try again</Text>
          </TouchableOpacity>
          <Text> </Text>
          <TouchableOpacity
            style={{...containerStyles.purpleButton, paddingHorizontal: '10%'}}
            onPress={confirmImage}
          >
            <Text style={textStyles.textBodyHeaderWhite}>Looks good!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  headerContainer: {
    padding: 20,
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subheader: {
    fontSize: 18,
    color: "gray",
  },
  image: {
    width: 400,
    height: 450,
    margin: 0,
  },
  miniContainer: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    margin: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  button: {
    padding: 10,
    margin: 10,
    borderRadius: 10,
    backgroundColor: "black",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ConfirmPhotoScreen;
