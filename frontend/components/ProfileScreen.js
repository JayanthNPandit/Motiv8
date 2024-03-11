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

    return (
        <View>
            <Text>Name: {"Jayanth"}</Text>
            <Text>Email: {"jnp@gmail.com"}</Text>
            <Text>Goals:</Text>
            <FlatList
                data={goals}
                renderItem={({ item }) => <Text>{item}</Text>}
                keyExtractor={(item, index) => index.toString()}
            />
            <Text>Images:</Text>
            <FlatList
                data={images}
                renderItem={({ item }) => <Image source={{ uri: item }} style={styles.image} />}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
}

export default ProfileScreen;