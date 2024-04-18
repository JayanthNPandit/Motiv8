// Mostly copied from UploadPhotoScreen as this is a similar functionality

import React, { useState, useEffect } from "react";
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
  ActivityIndicator,
  Alert,
  Touchable
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { ImageManipulator, manipulateAsync } from "expo-image-manipulator";
import { Camera } from "expo-camera";
import { useAuth } from "../contexts/AuthContext";
import {
  fetchGroupImages,
  fetchRecentGroupImages,
  addImageToDatabase,
  addToBucket,
  fetchUserData
} from "../backendFunctions.js";
import { textStyles, containerStyles } from "../styles/styles";
import * as MediaLibrary from "expo-media-library";

import download from "../assets/download.png";
import heart from "../assets/like.png";

const FeedScreen = ({ navigation }) => {
  const [allImages, setAllImages] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [refreshing, setRefreshing] = useState(false);

  const [isClicked, setIsClicked] = useState(false);

  const { user } = useAuth();

  // fetch some recent images from storage
  const fetchImages = async () => {
    const userData = await fetchUserData(user.uid);
    const images = await fetchGroupImages(user, userData.groupID);
    setAllImages(images);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchImages();
  }, [])

  useEffect(() => {
    if (allImages !== null) {
      console.log('.');
      console.log(allImages)
    }
  }, [allImages])

  const handleClick = () => {
    setIsClicked(!isClicked);
  };

  if (allImages === null) {
    return <ActivityIndicator/>
  }

  const onRefresh = () => {
    setRefreshing(true);
    fetchImages();
  };

  const handleSaveImage = async (imageUrl, imagePath) => {
    try {
      imagePath = imagePath + ".jpeg";
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === "granted") {
        const fileUrl = FileSystem.documentDirectory + imagePath;
        const downloadResumable = FileSystem.createDownloadResumable(
          imageUrl,
          fileUrl,
          {},
          false
        );
        const response = await downloadResumable.downloadAsync();
        console.log(response.uri);
        const asset = await MediaLibrary.createAssetAsync(response.uri);
        Alert.alert("Success!", "Image saved to camera roll");
      } else {
        Alert.alert(
          "Permission denied",
          "Unable to save image. Please grant permission to access the media library."
        );
      }
    } catch (error) {
      console.error("Error saving image:", error);
      Alert.alert("Error", "Failed to save image to camera roll");
    }
  };

  return (
    <View style={containerStyles.background}>
      <View style={{ ...containerStyles.container, marginHorizontal: 0 }}>
        <ScrollView style={{width: '100%'}} refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={containerStyles.headerContainer}>
          <Text style={textStyles.header}>Your Feed</Text>
          <Text style={textStyles.textBodyGray}>See what everyone's up to!</Text>
        </View>
        {allImages.length > 0 && (
          <FlatList
            data={allImages}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
            style={{ width: "100%", height: 500 * allImages.length }}
            renderItem={({ item }) => (
              <View style={styles.imageContainer}>
                <View style={styles.title}>
                  <Text style={textStyles.textBodyHeader}>{item.username}</Text>
                  <View style={styles.downloadContainer}>
                    <Text style={textStyles.textBodySmall}>
                      {item.timestampString}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        handleSaveImage(item.imageUrl, item.imagePath);
                      }}
                    >
                      <Image source={download} style={styles.download} />
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity onPress={handleClick} activeOpacity={0.9}>
                  <Image source={{ url: item.imageUrl }} style={styles.image} />
                  {isClicked && <View style={styles.clickedImage} />}
                </TouchableOpacity>
                {isClicked && (
                  <View style={styles.overlay}>
                    <Text style={textStyles.subheaderWhite}>Tagged Goals</Text>
                    {item.goals.map((item, index) => (
                      <View key={item} style={styles.goal}>
                        <Text
                          style={{
                            ...textStyles.textBodyHeaderWhite,
                            textAlign: "left",
                          }}
                        >
                          {" "}
                          {item}{" "}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
                <View style={styles.bottomHalf}>
                  <View style={styles.likes}>
                    <Image source={heart} />
                    <Text style={textStyles.textBodyHeaderPurpleBold}>
                      {item.likes}
                    </Text>
                  </View>
                  <View style={styles.caption}>
                    <Text style={textStyles.textBodySmall}>{item.caption}</Text>
                    <Text
                      style={{ ...textStyles.textBodySmall, color: "#8E99AB" }}
                    >
                      Tap photo to view associated goals
                    </Text>
                  </View>
                </View>
              </View>
            )}
          />
        )} 
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  miniContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#7b948b",
    borderRadius: 10,
    width: "95%",
  },
  halfContainer: {
    alignItems: "flex-start",
    justifyContent: "center",
    margin: 5,
  },
  choosing: {
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#a68d8d",
    padding: 10,
    marginHorizontal: 2,
    marginVertical: 5,
  },
  header: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 5,
  },
  text: {
    fontSize: 18,
  },
  image: {
    width: 350,
    height: 200,
    resizeMode: "cover",
    borderRadius: 10,
    borderWidth: 1,
  },
  message: {
    marginVertical: 7,
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  fullscreenImage: {
    width: "100%",
    height: "80%",
    resizeMode: "contain",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 16,
    color: "black",
  },
  calendar: {
    borderRadius: 10,
    marginBottom: "15%",
  },
  imageContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    marginVertical: "2%",
  },
  title: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    padding: 5,
    borderWidth: 1,
    borderColor: "#8E99AB",
  },
  image: {
    width: "100%",
    height: 300,
  },
  downloadContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  download: {
    width: 25,
    height: 25,
  },
  clickedImage: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  bottomHalf: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-around",
    paddingVertical: "2%",
    paddingHorizontal: "2%",
    borderWidth: 1,
    borderColor: "#8E99AB",
  },
  likes: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  caption: {
    paddingRight: "15%",
  },
  overlay: {
    position: "absolute",
    top: "15%", // Adjust position as needed
    left: "10%", // Adjust position as needed
    color: "white",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "white",
    zIndex: 10, // Ensure text appears above the image,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
    width: "80%",
    height: "50%",
  },
  goal: {
    width: "90%",
    paddingHorizontal: "1%",
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "white",
  },
});

export default FeedScreen;
