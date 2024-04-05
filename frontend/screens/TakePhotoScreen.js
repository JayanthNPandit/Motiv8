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

import snapImage from '../assets/snappicture.png';
import galleryImage from '../assets/gallery.png';
import uploadPictureImage from '../assets/uploadimage.jpg';

import defaultImage from '../assets/camera.png';


const TakePhotoScreen = ({navigation}) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [imageData, setImageData] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [refreshing, setRefreshing] = useState(false);

  const [takenImage, setTakenImage] = useState(false);

  const { user } = useAuth();

  // choosing the image
  const pickImage = async () => {

    // selected image
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.cancelled && result.assets) {
      setImageUrl(result.assets[0].uri);
    }
  };

  // taking the image
  const takeImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
      flashMode: Camera.Constants.FlashMode.off,
    });

    if (!result.cancelled && result.assets) {
      setImageUrl(result.assets[0].uri);
      setTakenImage(true);
    }
  };

  // upload the image
  const confirmImage = async () => {
    navigation.navigate("SharePhoto", {imageUrl: imageUrl});
  };

  const tryAgain = () => {
    setImageUrl(null);
    setTakenImage(false);
  };

  return (
    <View style={containerStyles.background}>
      <View style={containerStyles.container}>
      <Text style={textStyles.header}></Text>
      <Text style={textStyles.header}></Text>
        <View style={containerStyles.headerContainer}>
          <Text style={textStyles.header}> Snap your Progress! </Text>
        </View>
      <TouchableOpacity onPress={takeImage}>
        <View style={containerStyles.imageContainer}>
        {takenImage ? (
          <Image style={styles.image} source={{uri: imageUrl}} />
        ) : (
          <Image style={styles.image} source={defaultImage} />
        )}
        </View>
      </TouchableOpacity>
      <Text style={styles.buttonText}> Take Image </Text>
      {takenImage ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={tryAgain}>
            <Text>Try Again</Text>
          </TouchableOpacity>        
          <TouchableOpacity style={styles.button} onPress={uploadImage}>
          <Text>Confirm Image</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Image source={galleryImage}/>
          </TouchableOpacity>        
          <TouchableOpacity style={styles.button} onPress={takeImage}>
            <Image source={snapImage}/>
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
    width: 200,
    height: 200,
    margin: 20,
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
    backgroundColor: 'purple',
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default TakePhotoScreen;