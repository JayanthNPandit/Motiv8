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

const FeedScreen = ({ navigation }) => {
  const [allImages, setAllImages] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [refreshing, setRefreshing] = useState(false);

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
    }
  }, [allImages])

  return (
    <View style={containerStyles.background}>
      <View style={containerStyles.container}>
        <View style={containerStyles.headerContainer}>
          <Text style={textStyles.header}>Your Feed</Text>
          <Text style={textStyles.textBodyGray}>See what everyone’s up to!</Text>
        </View>

        <FlatList
          data={allImages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedImage(item.url);
                setModalVisible(true);
              }}
            >
              <View style={styles.message}>
                <Image source={{ url: item.url }} style={styles.image} />
                <Text>{item.caption}</Text>
              </View>
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchImages} />
          }
        />

        {/* {!imageUrl && (
          <View style={styles.choosing}>
            <TouchableOpacity style={styles.button} onPress={null}>
              <Text style={styles.text}>Choose picture</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takeImage}>
              <Text style={styles.text}>Take picture</Text>
            </TouchableOpacity>
          </View>
        )}

        {imageUrl && (
          <KeyboardAvoidingView
            style={styles.miniContainer}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={75}
          >
            <View style={styles.halfContainer}>
              <TextInput
                placeholder="add a caption"
                placeholderTextColor="#88898a"
                onChangeText={setCaption}
                style={{ padding: 3, fontSize: 18 }}
              />
              <Dropdown
                placeholder="Select goals"
                data={goals}
                onChangeText={(selectedGoals) => setGoals(selectedGoals)}
                containerStyle={{ width: "100%", marginTop: 10 }}
                dropdownOffset={{ top: 10 }}
                dropdownPosition={-4}
                itemStyle={{ justifyContent: "flex-start" }}
                multiple={true}
                searchInputPlaceholderText="Search goals..."
                searchInputStyle={{ fontSize: 16 }}
                searchContainerStyle={{ padding: 5 }}
                chip={true}
                chipType="outlined"
                chipStyle={{ backgroundColor: "#e0e0e0" }}
                chipTextStyle={{ color: "#333" }}
                selectedItemColor="#333"
                textColor="#333"
              />
            </View>

            <View style={styles.halfContainer}>
              <TouchableOpacity style={styles.button} onPress={addImage}>
                <Text style={styles.text}>Send</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={cancelImage}>
                <Text style={styles.text}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        )} */}

        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalView}>
            <Image
              source={{ url: selectedImage }}
              style={styles.fullscreenImage}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
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
});

export default FeedScreen;
