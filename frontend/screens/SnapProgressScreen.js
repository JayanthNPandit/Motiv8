// screen that has 2 images and 2 buttons where the first button is an option to take a picture and the second button is an option to upload a picture
// Path: GroupGoals/frontend/screens/SharePhotoScreen.js

import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
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

import snapImage from "../assets/takepictureimage.png";
import galleryImage from "../assets/uploadpictureimage.png";

const SnapProgressScreen = () => {
  const navigation = useNavigation();

  const [imageUrl, setImageUrl] = useState();
  const [takenImage, setTakenImage] = useState(false);

  // Taking a photo
  const takeImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
      flashMode: Camera.Constants.FlashMode.off, // Change this line
    });

    if (!result.cancelled && result.assets) {
      setImageUrl(result.assets[0].uri);
      setTakenImage(true);
      navigation.navigate("ConfirmPhoto", { imageUrl: result.assets[0].uri });
    }
  };

  // Selecting an image from gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled && result.assets) {
      setImageUrl(result.assets[0].uri);
      setTakenImage(true);
      navigation.navigate("ConfirmPhoto", { imageUrl: result.assets[0].uri });
    }
  };

  return (
    <View style={containerStyles.background}>
      <View style={containerStyles.container}>
        <View style={{...containerStyles.headerContainer, marginTop: '7%'}}>
          <Text style={textStyles.header}> Snap Your Progress </Text>
          <Text style={textStyles.textBodyGray}> Choose how to upload </Text>
        </View>
        <View style={containerStyles.listContainer}>
          <Image source={snapImage} style={styles.image} />
          <Text></Text>
          <Text style={textStyles.textBodyGray}>
            {" "}
            Take a picture, in the moment!{" "}
          </Text>
          <TouchableOpacity
            style={containerStyles.blueButton}
            onPress={takeImage}
          >
            <Text style={textStyles.textBodyHeaderWhite}> Open Camera </Text>
          </TouchableOpacity>
        </View>

        <View style={containerStyles.divider}></View>

        <View style={containerStyles.listContainer}>
          <Image source={galleryImage} style={styles.image} />
          <Text></Text>
          <Text style={textStyles.textBodyGray}>
            {" "}
            Forgot to upload a photo? No worries,{"\n"} we've got you covered.{" "}
          </Text>
          <TouchableOpacity
            style={containerStyles.blueButton}
            onPress={pickImage}
          >
            <Text style={textStyles.textBodyHeaderWhite}> Upload a picture </Text>
          </TouchableOpacity>
        </View>
        <Text></Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 50,
  },
  image: {
    width: "40%",
    height: "40%",
  },
});

export default SnapProgressScreen;
