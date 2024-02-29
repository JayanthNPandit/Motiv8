import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Text, FlatList, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
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

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === 'granted');
    })();
  }, []);


  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.cancelled) {
      // setImageUri(result.assets[0].uri);
      // console.log(imageUri);

      setImageUri((prevUri) => {
        const newUri = result.assets[0].uri;
        console.log("New Image Data:", newUri);
        return newUri;
      });
    }
  };

  const addImage = async () => {
    if (imageUri) {
      const downloadUrl = await addToFirebase(imageUri);
      setImageData([...imageData, { uri: downloadUrl, caption: caption}]);
      setImageUri(null); // Clear imageUri after adding
      setCaption('');
    }
  };

  const addToFirebase = async (imageUri) => {
    const response = await fetch(imageUri);
    console.log("woohoo");
    const blob = await response.blob();
    console.log("yippee");
    const imageRef = ref(storage, `images/${new Date().toISOString()}`);
    console.log("wompwomp");
    try {
      await uploadBytes(imageRef, blob);
    } catch (e) {
      throw e;
    }
    console.log("vincent");
    const downloadUrl = await getDownloadURL(imageRef);
    return downloadUrl
  };

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