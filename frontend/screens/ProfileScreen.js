import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { fetchUserData, changeUserData } from "../backendFunctions";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import image from '../assets/default-pfp.png';

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { ImageManipulator, manipulateAsync } from 'expo-image-manipulator';
import { Camera } from 'expo-camera';

import loadFonts from '../fonts/loadFonts';

const ProfileScreen = ({navigation}) => {
    
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [name, setName] = useState("");
    const [origName, setOrigName] = useState("");
    const [username, setUsername] = useState("");
    const [imageUrl, setImageUrl] = useState(null);
    const [isClickable, setIsClickable] = useState(true);
    
    const { user, logout } = useAuth();

    useEffect(() => loadFonts(), []);
    useEffect(() => {
        fetchUserData(user)
        .then((data) => {
            setName(data.name);
            setOrigName(data.name);
            setUsername(data.username);
            setImageUrl(data.profilePicture);
            console.log(name)
        })
    }, []);

    const handleLogout = async () => {
        setIsClickable(false);
        await logout();
        setIsClickable(true);
        navigation.navigate("Welcome");
    }

    const handleChange = async () => {
        setIsClickable(false);
        await changeUserData(user, name, username, imageUrl);
        setOrigName(name);
        setIsClickable(true);
    }

    // copied from
    return (
        <View style={{backgroundColor:'white', flex: 1}}>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.header}> Hi, {origName}! </Text>
                    <Text style={styles.subheader}> Let's edit your profile </Text>
                </View>
                <Image style={styles.image} source={imageUrl==null ? image : {url: imageUrl}}/>
                <View style={styles.miniContainer}>
                    <TextInput style={styles.input} value={name} onChangeText={setName}/>
                    <TextInput style={styles.input} value={username} onChangeText={setUsername}/>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.backButton} onPress={handleLogout} disabled={!isClickable}>
                        <Text style={styles.backButtonText}> Back </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleChange} disabled={!isClickable}>
                        <Text style={styles.buttonText}> Confirm </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginHorizontal: '5%',
        marginVertical: '20%',
        backgroundColor: 'white'
    },
    // HEADER CONTAINER STYLING
    headerContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '5%',
        gap: 8
    },
    header: {
        color: 'black', 
        fontSize: 24, 
        fontFamily: 'Poppins-Bold',
    },
    subheader: {
        color: '#8692A6',
        fontSize: 16,
        fontFamily: 'Poppins',
        fontWeight: '400',
        lineHeight: 28
    },
    // SIGN IN BUTTON STYLING
    button: {
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center',
        paddingVertical: '4%',
        paddingHorizontal: '15%',
        backgroundColor: '#4044AB',
        borderRadius: 31, 
        gap: 10,
        marginVertical: '5%'
    },
    buttonText: {
        color: 'white', 
        fontSize: 14, 
        fontFamily: 'Poppins', 
        fontWeight: '400'
    },
    // INPUT CONTAINER STYLING
    miniContainer: {
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        gap: 35, 
        display: 'flex',
        marginVertical: '5%',
        width: '92%'
    },
    input: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#9A9A9A',
        width: '100%', 
        paddingHorizontal: '2%',
        paddingVertical: '4.5%',
    },
    // BUTTON CONTAINER
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    // BACK BUTTON
    backButton: {
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center',
        paddingVertical: '4%',
        paddingHorizontal: '15%',
        backgroundColor: 'white',
        borderRadius: 62, 
        borderWidth: 1,
        gap: 10,
        marginVertical: '4%'
    },
    backButtonText: {
        color: 'black', 
        fontSize: 14, 
        fontFamily: 'Poppins', 
        fontWeight: '400'
    },
    // IMAGE
    image: {
        width: '80%',
        height: '40%',
        borderRadius: 2000,
        marginVertical: '5%'
    }
});

export default ProfileScreen;