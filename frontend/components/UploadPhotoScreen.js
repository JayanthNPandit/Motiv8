import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Text, FlatList, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, RefreshControl, Platform, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { ImageManipulator, manipulateAsync } from 'expo-image-manipulator';
import { Camera } from 'expo-camera';
import { storage, fetchGroupImages, addImageToDatabase, addToBucket } from '../firebaseConfig.js';



const UploadPhotoScreen = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [caption, setCaption] = useState('');
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [imageData, setImageData] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [refreshing, setRefreshing] = useState(false);

  const backend = process.env.BACKEND_URL;

  // YASH
  const userID = 'H4W3jcMJTVUXc3KOWmg0PlSpdsy2';
  const goalID = 'nPnXBLlRi6LCeCAZtUyP';
  const groupID = '2vc4eiJZ8eap0fnmfDVf';
  
  // VENKAT
  const userID2 = 'ED7pVVZgH1PigTO4pwA3B9WM9bX2';
  const goalID2 = 'xRBJHrwlWTvBKrS821jS';

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === 'granted');
      fetchImages();
    })();
  }, []);

  // fetch images from storage
  const fetchImages = async () => {
    const images = await fetchGroupImages(groupID);
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

    if (!result.cancelled) {
      const url = result.assets[0].uri;
      const fileInfo = await FileSystem.getInfoAsync(url);
      const originalFileSize = fileInfo.size;
      // compress if greater than 1.5 MB (prevents crashing)
      if (originalFileSize > (1024 * 1024 * 1.5)) {
        const compressedImage = await manipulateAsync(url, [], { compress: 0.3 });
        setImageUrl(compressedImage.uri);
      } else {
        setImageUrl(url);
      }
    }
  };

  // taking the image
  const takeImage = async () => {
    // IMPLEMENT
  }

  // adding the image to the screen
  const addImage = async () => {
    if (imageUrl) {
      const {downloadUrl, name} = await addToBucket(imageUrl);
      await addImageToDatabase(userID, goalID, caption, name, downloadUrl);
      setImageData([...imageData, { url: downloadUrl, caption: caption}]);
      setImageUrl(null);
      setCaption('');
    }
  };

  return (
    <View style={styles.container}>
        <Text style={styles.header}> MOTIV8 </Text>
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
            <TouchableOpacity style={styles.button} onPress={pickImage}>
                <Text style={styles.text}>Choose image from gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takeImage}>
                <Text style={styles.text}>Take picture - not implemented</Text>
            </TouchableOpacity>
        </View>
        )}
            
        {imageUrl && (
        <KeyboardAvoidingView style={styles.miniContainer} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={75}>
            <View style={styles.halfContainer}>
                <Image source={{ url: imageUrl }} style={{ width: 275, height: 200, borderRadius: 10, borderWidth: 1 }} />
                <TextInput 
                    placeholder='add a caption' 
                    placeholderTextColor='#88898a'
                    onChangeText={setCaption}
                    style = {{padding: 3, fontSize: 18}}
                />
            </View>
            
            <TouchableOpacity style={styles.button} onPress={addImage}>
                <Text style={styles.text}>Send</Text>
            </TouchableOpacity>
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

export default UploadPhotoScreen;