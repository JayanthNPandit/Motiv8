import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Text, FlatList, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';

const UploadPhotoScreen = () => {
  const [imageUri, setImageUri] = useState(null);
  const [caption, setCaption] = useState('');
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [imageData, setImageData] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === 'granted');
    })();
  }, []);

  const uploadImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const addImage = () => {
    if (imageUri) {
      setImageData([...imageData, { uri: imageUri, caption: caption}]);
      setImageUri(null); // Clear imageUri after adding
      setCaption('');
    }
  };

  return (
    <View style={styles.container}>
        <Text style={styles.header}> GROUP IMAGES </Text>
        <FlatList
            data={imageData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
            <View style={styles.message}>
                <Image source={{ uri: item.uri }} style={styles.image} />
                <Text>{item.caption}</Text>
            </View>
            )}
        />
        
        {!imageUri && (
        <View>
            <TouchableOpacity style={styles.button} onPress={uploadImage}>
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
  }
})

export default UploadPhotoScreen;