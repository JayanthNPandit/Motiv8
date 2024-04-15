// Mostly copied from UploadPhotoScreen as this is a similar functionality

import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Text, FlatList, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, RefreshControl, Platform, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { ImageManipulator, manipulateAsync } from 'expo-image-manipulator';
import { Camera } from 'expo-camera';
import { useAuth } from "../contexts/AuthContext";
import { fetchGroupImages, fetchRecentGroupImages, addImageToDatabase, addToBucket } from '../backendFunctions.js';


const FeedScreen = ({navigation}) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [caption, setCaption] = useState('');
  const [goals, setGoals] = useState([]);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [imageData, setImageData] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [refreshing, setRefreshing] = useState(false);

  const { user } = useAuth();

  // fetch some recent images from storage
  const fetchImages = async () => {
    var limit = 30;
    const images = await fetchRecentGroupImages(user, groupID, limit); // hard coded value for now
    setImageData(images);
    setRefreshing(false);
  };

  // taking the image using the camera
  const takeImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled && result.assets) {
      const uri = result.assets[0].uri;
      const fileInfo = await FileSystem.getInfoAsync(uri);
      const originalFileSize = fileInfo.size;
      // compress if greater than 1.5 MB to avoid crashes
      if (originalFileSize > (1024 * 768 * 1.5)) { // 1024 x 78 for 4:3 aspect ratio for images
        const compressedImage = await manipulateAsync(uri, [], { compress: 0.3 });
        setImageUrl(compressedImage.uri);
      } else {
        setImageUrl(uri);
      }
    }
  }

  // adding the image to the screen
  const addImage = async () => {
    if (imageUrl) {
      const {downloadUrl, name} = await addToBucket(imageUrl);
      await addImageToDatabase(userID, goals, caption, name, downloadUrl);
      setImageData([{ url: downloadUrl, caption: caption}, ...imageData]);
      setImageUrl(null);
      setCaption('');
      setGoals([...goals, newGoal]);
      // It should have a drop down with the user's goals and they can choose the ones they want to apply to this image
      
    }
  };

  const cancelImage = async () => {
    setImageUrl(null);
    setCaption('');
  }

  return (
    <View style={styles.container}>
        <Text style={styles.header}> Your Feed </Text>
        <FlatList
            data={imageData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedImage(item.url);
                  setModalVisible(true);
                }}
              >
                <View style={styles.message}>
                  <Image source={{url: item.url}} style={styles.image} />
                  <Text>{item.caption}</Text>
                </View>
              </TouchableOpacity>
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={fetchImages}
              />
            }
        />
        
        {!imageUrl && (
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
        <KeyboardAvoidingView style={styles.miniContainer} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={75}>
            <View style={styles.halfContainer}>
                <TextInput 
                    placeholder='add a caption' 
                    placeholderTextColor='#88898a'
                    onChangeText={setCaption}
                    style = {{padding: 3, fontSize: 18}}
                />
                <Dropdown
                    placeholder='Select goals'
                    data={goals}
                    onChangeText={(selectedGoals) => setGoals(selectedGoals)}
                    containerStyle={{width: '100%', marginTop: 10}}
                    dropdownOffset={{top: 10}}
                    dropdownPosition={-4}
                    itemStyle={{justifyContent: 'flex-start'}}
                    multiple={true}
                    searchInputPlaceholderText='Search goals...'
                    searchInputStyle={{fontSize: 16}}
                    searchContainerStyle={{padding: 5}}
                    chip={true}
                    chipType='outlined'
                    chipStyle={{backgroundColor: '#e0e0e0'}}
                    chipTextStyle={{color: '#333'}}
                    selectedItemColor='#333'
                    textColor='#333'
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
        )}

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
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 70,
    marginBottom: 30
  },
  miniContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#7b948b',
    borderRadius: 10,
    width: '95%'
  },
  halfContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    margin: 5,
  },
  choosing: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#a68d8d',
    padding: 10,
    marginHorizontal: 2,
    marginVertical: 5
  },
  header: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 5
  },
  text: {
    fontSize: 18
  },
  image: {
    width: 350, 
    height: 200, 
    resizeMode: 'cover',
    borderRadius: 10,
    borderWidth: 1,
  },
  message: {
    marginVertical: 7
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
})

export default FeedScreen;