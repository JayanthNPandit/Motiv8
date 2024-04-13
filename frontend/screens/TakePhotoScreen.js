// a screen that allows the user to take a picture, add a caption, and select goals to apply to the image

import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { fetchGroupImages, fetchRecentGroupImages, addImageToDatabase, addToBucket } from '../backendFunctions.js';
import { View, Image, TouchableOpacity, Text, FlatList, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, RefreshControl, Platform, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { ImageManipulator, manipulateAsync } from 'expo-image-manipulator';
import { Camera } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { containerStyles, textStyles } from '../styles/styles.js';
import { useRoute } from '@react-navigation/native';

import snapImage from '../assets/snappicture.png';
import galleryImage from '../assets/gallery.png';

import defaultImage from '../assets/graybox.png';


const TakePhotoScreen = ({navigation}) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [imageData, setImageData] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [refreshing, setRefreshing] = useState(false);

  const [takenImage, setTakenImage] = useState(false);

  const { user } = useAuth();

  const route = useRoute();

  const { takePhoto } = route.params;

  useEffect(() => {
    if (takePhoto) {
      takeImage();
    } else {
      pickImage();
    }
  }, []);

  

  // upload the image
  const confirmImage = async () => {
    navigation.navigate("SharePhoto", {imageUrl: imageUrl});
  };

  const tryAgain = () => {
    setImageUrl(null);
    setTakenImage(false);
    navigation.navigate("SnapProgress");
  };

  return (
    <View style={containerStyles.background}>
      <View style={containerStyles.container}>
        <View style={containerStyles.headerContainer}>
          <Text style={textStyles.header}>
            Looking Good!
          </Text>
        </View>
        <TouchableOpacity onPress={takeImage}>
          <View style={containerStyles.imageContainer}>
            {takenImage && (
              <Image style={styles.image} source={{ uri: imageUrl }} />
            )}
          </View>
        </TouchableOpacity>
        {takenImage && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={containerStyles.whiteButton} onPress={tryAgain}>
              <Text>Try Again</Text>
            </TouchableOpacity>
            <Text>      </Text>    
            <TouchableOpacity style={containerStyles.purpleButton} onPress={confirmImage}>
              <Text>Confirm Image</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  headerContainer: {
    padding: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subheader: {
    fontSize: 18,
    color: 'gray',
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
    borderColor: 'gray',
    padding: 10,
    margin: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    padding: 10,
    margin: 10,
    borderRadius: 10,
    backgroundColor: 'black',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default TakePhotoScreen;