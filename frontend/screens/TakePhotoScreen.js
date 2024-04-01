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
import defaultImage from '../assets/camera.png';
import { containerStyles, textStyles } from '../styles/styles.js';


const TakePhotoScreen = ({navigation}) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [caption, setCaption] = useState('');
  const [goals, setGoals] = useState([]);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [imageData, setImageData] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [refreshing, setRefreshing] = useState(false);

  const [takenImage, setTakenImage] = useState(false);

  const { user } = useAuth();

  exampleGoals = [
    'Run 5 miles',
    'Read 50 pages',
    'Drink 8 cups of water',
    'Meditate for 10 minutes',
    'Complete a coding challenge',
    'Cook a new recipe',
    'Write in a journal',
  ];

  // fetch some recent images from storage
  const fetchImages = async () => {
    var limit = 7;
    const images = await fetchRecentGroupImages(user, groupID, limit); // hard coded value for now
    setImageData(images);
    setRefreshing(false);
  };

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
  const uploadImage = async () => {
    if (imageUrl) {
      const image = await FileSystem.readAsStringAsync(imageUrl, { encoding: FileSystem.EncodingType.Base64 });
      const url = await addToBucket(image);
      const id = await addImageToDatabase(user, groupID, caption, url, goals);
      if (!id) {
        Alert.alert("Error uploading image. Try again");
      }
      else {
        setImageUrl(null);
        setCaption('');
        setGoals([]);
        navigation.navigate("Feed");
      }
    }
  };

  const addToGoals = (goal) => {
    if (goals.includes(goal)) {
      setGoals(goals.filter((item) => item !== goal));
    } else {
      setGoals([...goals, goal]);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}></Text>
      <Text style={styles.header}></Text>
        <View style={styles.headerContainer}>
          <Text style={styles.header}> Share your Photo! </Text>
        </View>
      <TouchableOpacity onPress={takeImage}>
        <View style={styles.imageContainer}>
        {takenImage ? (
          <Image style={styles.image} source={{uri: imageUrl}} />
        ) : (
          <Image style={styles.image} source={defaultImage} />
        )}
        </View>
      </TouchableOpacity>
      <Text style={styles.buttonText}> Take Image </Text>
      <View style={styles.miniContainer}>
        <TextInput style={styles.input} value={caption} onChangeText={setCaption} placeholder="Add a caption"/>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}> Choose Image </Text>
        </TouchableOpacity>        
        <TouchableOpacity style={styles.button} onPress={uploadImage}>
          <Text style={styles.buttonText}> Upload Image </Text>
        </TouchableOpacity>
      </View>
      <View style={containerStyles.listContainer}>
        <FlatList
          data={exampleGoals}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={containerStyles.purpleButton} onPress={addToGoals(item)}>
              <Text style={textStyles.goalText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
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
  imageContainer: {
    alignItems: 'center',
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