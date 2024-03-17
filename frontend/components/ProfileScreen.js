import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Text, FlatList, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, RefreshControl, Platform, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { ImageManipulator, manipulateAsync } from 'expo-image-manipulator';
import { storage, fetchUserImages, addToBucket } from '../backendFunctions.js';

const ProfileScreen = () => {
    // state variables
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [goals, setGoals] = useState([]);
    const [images, setImages] = useState([]);

    const [isClickable, setIsClickable] = useState(true);

    const [imageUrl, setImageUrl] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);

    useEffect(() => {
        // Fetch user data and images from backend
        fetchUserData();
        fetchUserImages();
    }, []);

    const fetchUserData = async () => {
        // Fetch user data from backend and update state variables
        try {
            // Make API call to fetch user data
            const response = await fetch('/api/user');
            const data = await response.json();
            setName(data.name);
            setEmail(data.email);
            setGoals(data.goals);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchUserImages = async () => {
        // Fetch user images from backend and update state variable
        try {
            // Make API call to fetch user images
            const response = await fetch('/api/images');
            const data = await response.json();
            setImages(data.images);
        } catch (error) {
            console.error('Error fetching user images:', error);
        }
    };

    // copied from
    return (
        <View style={{backgroundColor:'white', flex: 1}}>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.header}> This is you! </Text>
                </View>
                <Image style={styles.image} source={imageUrl==null ? image : {url: imageUrl}}/>
                <TouchableOpacity style={styles.button} onPress={pickImage}>
                    <Text style={styles.buttonText}> Add a profile photo </Text>
                </TouchableOpacity>
                <View style={styles.miniContainer}>
                    <TextInput style={styles.input} placeholder="Change your username" onChange={setUsername}/>
                    <TextInput style={styles.input} placeholder="Change your name" onChange={setName}/>
                    <TextInput style={styles.input} placeholder="Chnage your weight" onChange={setWeight}/>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.backButton} onPress={deleteUserAndTryAgain} disabled={!isClickable}>
                        <Text style={styles.backButtonText}> Back </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={addUserInfo} disabled={!isClickable}>
                        <Text style={styles.buttonText}> Next </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

export default ProfileScreen;