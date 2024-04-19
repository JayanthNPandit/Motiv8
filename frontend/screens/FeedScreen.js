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
  Touchable,
  Dimensions
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { ImageManipulator, manipulateAsync } from "expo-image-manipulator";
import { Camera } from "expo-camera";
import { useAuth } from "../contexts/AuthContext";
import {
  fetchGroupImages,
  addImageToDatabase,
  addToBucket,
  fetchUserData,
  likeImage,
  unlikeImage,
} from "../backendFunctions.js";
import { textStyles, containerStyles } from "../styles/styles";
import * as MediaLibrary from "expo-media-library";

import download from "../assets/download.png";
import heart from "../assets/like.png";
import liked_heart from "../assets/liked_heart.png";

const FeedScreen = ({ navigation }) => {
  const [allImages, setAllImages] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [clickable, setIsClickable] = useState(true);

  const { user } = useAuth();

  // fetch some recent images from storage
  const fetchImages = async () => {
    const userData = await fetchUserData(user.uid);
    const images = await fetchGroupImages(user, userData.groupID);
    setAllImages(images);
    setRefreshing(false);
  };

  const handleLike = async (photo) => {
    setIsClickable(false);
    await likeImage(user, photo);
    await fetchImages();
    setIsClickable(true);
  };

  const handleUnlike = async (photo) => {
    setIsClickable(false);
    await unlikeImage(user, photo);
    await fetchImages();
    setIsClickable(true);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (allImages !== null) {
      console.log("loading images");
    }
  }, [allImages]);

  const handleClick = () => {
    setIsClicked(!isClicked);
  };

  if (allImages === null || user === null) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView
      style={containerStyles.background}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchImages} />
      }
    >
      <View style={{ ...containerStyles.container, marginHorizontal: 0 }}>
        <View style={{ width: "100%" }}>
          <View style={containerStyles.headerContainer}>
            <Text style={textStyles.header}>Your Feed</Text>
            <Text style={textStyles.textBodyGray}>
              See what everyone's up to!
            </Text>
          </View>
          {allImages.length > 0 && (
            <FlatList
              data={allImages}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
              style={{ width: "100%", height: (screenWidth + 200) * allImages.length }}
              renderItem={({ item }) => (
                <View style={styles.imageContainer}>
                  <View style={styles.title}>
                    <Text style={textStyles.textBodyHeader}>
                      {item.username}
                    </Text>
                    <Text style={textStyles.textBodySmall}>
                      {item.timestampString}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={handleClick} activeOpacity={0.9}>
                    <Image
                      source={{ url: item.imageUrl }}
                      style={styles.image}
                    />
                    {isClicked && <View style={styles.clickedImage} />}
                  </TouchableOpacity>
                  {isClicked && (
                    <View style={styles.overlay}>
                      <Text style={textStyles.subheaderWhite}>
                        Tagged Goals
                      </Text>
                      {item.goals.map((item, index) => (
                        <View key={item} style={styles.goal}>
                          <Text
                            style={{
                              ...textStyles.textBodyHeaderWhite,
                              textAlign: "left",
                            }}
                          >
                            {item}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                  <View style={styles.bottomHalf}>
                    <View style={styles.caption}>
                      <Text style={textStyles.textBodySmall}>
                        {item.caption}
                      </Text>
                      <Text
                        style={{
                          ...textStyles.textBodySmall,
                          color: "#8E99AB",
                        }}
                      >
                        Tap photo to view associated goals
                      </Text>
                    </View>
                    {item.likes.includes(user.uid) ? (
                      <TouchableOpacity
                        style={styles.likes}
                        onPress={() => {
                          handleUnlike(item);
                        }}
                        disabled={!clickable}
                        activeOpacity={0.5}
                      >
                        <Image
                          source={liked_heart}
                          style={{ width: 50, height: 50 }}
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.likes}
                        onPress={() => {
                          handleLike(item);
                        }}
                        disabled={!clickable}
                        activeOpacity={0.5}
                      >
                        <Image
                          source={heart}
                          style={{ width: 50, height: 50 }}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  imageContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  title: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 13,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#8E99AB",
  },
  image: {
    width: screenWidth,
    height: screenWidth,
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
    bottom: "8.5%",
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
    paddingHorizontal: "3%",
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "white",
  },
});

export default FeedScreen;
