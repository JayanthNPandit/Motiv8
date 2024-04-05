// lets you share the progress after you take a photo using TakePhotoScreen.js

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
import { addProgress } from '../backendFunctions';

const ShareProgressScreen = ({navigation}) => {
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
    
    const [goalID, setGoalID] = useState(null);
    const [groupID, setGroupID] = useState(null);
    
    const navigation2 = useNavigation();
    
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
    
    // take a photo
    const takePhoto = async () => {
        // selected image
        let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 1,
        });
    
        if (!result.cancelled && result.assets) {
        setImageUrl(result.assets[0].uri);
        }
    };
    
    // upload the image
    const uploadImage = async () => {
        const image = await FileSystem.readAsStringAsync(imageUrl, {
        encoding: FileSystem.EncodingType.Base64,
        });
    
        const id = await addImageToDatabase(user, image, caption, goalID, groupID);
    
        if (id) {
        console.log("Image uploaded successfully");
        setCaption('');
        setImageUrl(null);
        setTakenImage(false);
        navigation.navigate("Group");
        } else {
        console.log("Error uploading image. Try again");
        }
    };
    
    // add progress
    const addProgress = async () => {
        const id = await addProgress(user, goalID, caption, imageUrl, goals);
    
        if (id) {
        console.log("Progress added successfully");
        setCaption('');
        setImageUrl(null);
        setGoals([]);
        navigation.navigate("Group");
        } else {
        console.log("Error adding progress. Try again");
        }
    };
    
    // add to goals
    const addToGoals = (goal) => {
        if (goals.includes(goal)) {
        setGoals(goals.filter((item) => item !== goal));
        } else {
        setGoals([...goals, goal]);
        }
    };

    return (
        <View style={containerStyles.background}>
            <View style={containerStyles.container}>
                <View style={containerStyles.headerContainer}>
                    <Text style={textStyles.header}> Share Progress </Text>
                    <Text style={textStyles.textBodyGray}>Share your progress with your group! </Text>
                </View>
    
                <View style={containerStyles.purpleInputContainer}>
                    <Text style={textStyles.textBodyHeader}> Add a caption: </Text>
                    <TextInput style={containerStyles.input} value={caption} onChangeText={setCaption}/>
    
                    <Text style={textStyles.textBodyHeader}> Choose a goal: </Text>
                    <FlatList
                        data={goals}
                        renderItem={({item}) => (
                        <TouchableOpacity onPress={() => addToGoals(item)}>
                            <Text style={textStyles.textBody}>{item}</Text>
                        </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item}
                    />
    
                    <Text style={textStyles.textBodyHeader}> Choose an image: </Text>
                    <TouchableOpacity onPress={pickImage}>
                        <Image source={imageUrl ? { uri: imageUrl } : defaultImage} style={styles.image}/>
                    </TouchableOpacity>
    
                    <TouchableOpacity style={containerStyles.button} onPress={addProgress}>
                        <Text style={textStyles.buttonText}> Add Progress </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    image: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
});

export default ShareProgressScreen;
