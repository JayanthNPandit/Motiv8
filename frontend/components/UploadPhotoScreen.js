import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Text, FlatList, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { ImageManipulator, manipulateAsync } from 'expo-image-manipulator';
import { Camera } from 'expo-camera';
import { storage } from '../firebaseConfig.js';
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage"; // Import storage methods


const UploadPhotoScreen = () => {
  const [imageUri, setImageUri] = useState(null);
  const [caption, setCaption] = useState('');
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [imageData, setImageData] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // hardcoded
  const userID = 'H4W3jcMJTVUXc3KOWmg0PlSpdsy2';
  const goalID = 'nPnXBLlRi6LCeCAZtUyP';
  const backend = process.env.BACKEND_URL;


  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === 'granted');
      fetchImages();
    })();
  }, []);

  // fetch images from storage
  const fetchImages = async () => {
    const imagesListRef = ref(storage, "images/");
    try {
      const imageRefs = await listAll(imagesListRef);
      //console.log("Image references:", imageRefs);
      const imageUrls = await Promise.all(
        imageRefs.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          //console.log("Image URL:", url);
          return { uri: url, caption: "" }; // Assuming there are no captions stored in the database
        })
      );
      setImageData(imageUrls);
      //console.log("Image URLs set to state:", imageUrls);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
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
      const uri = result.assets[0].uri;
      const fileInfo = await FileSystem.getInfoAsync(uri);
      const originalFileSize = fileInfo.size;
      // compress if greater than 1.5 MB (prevents crashing)
      if (originalFileSize > (1024 * 1024 * 1.5)) {
        const compressedImage = await manipulateAsync(uri, [], { compress: 0.3 });
        setImageUri(compressedImage.uri);
      } else {
        setImageUri(uri);
      }
      
    }
  };

  // adding the image to the screen
  const addImage = async () => {
    if (imageUri) {
      const {downloadUrl, name} = await addToFirebase(imageUri);
      await addImageToDB(userID, goalID, caption, name, downloadUrl);
      setImageData([...imageData, { uri: downloadUrl, caption: caption}]);
      setImageUri(null);
      setCaption('');
    }
  };

  // adding the image to the bucket
  const addToFirebase = async (imageUri) => {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const name = `images/${new Date().toISOString()}`;
    const imageRef = ref(storage, name);

    try {
      await uploadBytes(imageRef, blob);
    } catch (e) {
      console.log(e);
      throw e;
    }
    
    const downloadUrl = await getDownloadURL(imageRef);
    return {downloadUrl, name};
  };

  // add the image to the database
  const addImageToDB = async (userID, goalID, caption, name, url) => {
    try {
      console.log("started");
      console.log(name);
      const response = await fetch(`http://localhost:3001/addImageToDatabase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': "application/json"
        },
        body: JSON.stringify({
          'userID': userID,
          'goalID': goalID,
          'caption': caption,
          'name': name,
          'timestamp': name.substring(7),
          'imageUrl': url,
        }),
      });
      
      console.log("got to here");
      const result = await response.json();
  
      if (result.success) {
        console.log('Image added to the database successfully');
      } else {
        console.error('Error adding image to the database:', result.error);
      }
    } catch (error) {
      console.error('Error adding image to the database:', error);
    }
  }

  return (
    <View style={styles.container}>
        <Text style={styles.header}> GROUP IMAGES </Text>
        <FlatList
            data={imageData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedImage(item.uri);
                  setModalVisible(true);
                }}
              >
                <View style={styles.message}>
                  <Image source={{ uri: item.uri }} style={styles.image} />
                  <Text>{item.caption}</Text>
                </View>
              </TouchableOpacity>
            )}
        />
        
        {!imageUri && (
        <View>
            <TouchableOpacity style={styles.button} onPress={pickImage}>
                <Text style={styles.text}>Choose image from gallery</Text>
            </TouchableOpacity>
        </View>
        )}
            
        {imageUri && (
        <KeyboardAvoidingView style={styles.miniContainer} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={75}>
            <View style={styles.halfContainer}>
                <Image source={{ uri: imageUri }} style={{ width: 275, height: 200, borderRadius: 10, borderWidth: 1 }} />
                <TextInput 
                    placeholder='add a caption' 
                    placeholderTextColor='#88898a'
                    onChangeText={setCaption}
                    style = {{padding: 3}}
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
            source={{ uri: selectedImage }}
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
    fontSize: 20
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