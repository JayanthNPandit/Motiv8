import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { createUser } from "../backendFunctions";
import { deleteUser } from 'firebase/auth';

import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import image from '../assets/default-pfp.png';

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { ImageManipulator, manipulateAsync } from 'expo-image-manipulator';
import { Camera } from 'expo-camera';

import loadFonts from '../fonts/loadFonts';

const Onboarding = ({navigation}) => {

    const { user } = useAuth();

    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [weight, setWeight] = useState("");

    const [isClickable, setIsClickable] = useState(true);

    const [imageUrl, setImageUrl] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);

    useEffect(() => {
        (async () => {
          const { status } = await Camera.requestCameraPermissionsAsync();
          setHasCameraPermission(status === 'granted');
          // reprompt for camera permissions if they deny
          if (status !== 'granted') {
            alert('We need camera permissions for this app to work');
            // reprompt
          }
        })();
    }, []);

    useEffect(() => {
        // Load fonts when the app starts
        loadFonts();
    }, []);

    // choosing the image
    const pickImage = async () => {

        // selected image
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            quality: 1,
        });

        if (!result.cancelled && result.assets) {
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

    const deleteUserAndTryAgain = async () => {
        try {
            await deleteUser(user);
        } catch (error) {
            console.log(error);
        }
        navigation.navigate("SignUp");
    }

    const addUserInfo = async () => {
        console.log(user.accessToken);
        setIsClickable(false);

        // test inputs
        const regex = /\D/;
        if (username === '' || name === '' || weight == '' || regex.test(weight)) {
            Alert.alert('Empty fields or weight contains non-numeric characters');
            setIsClickable(true);
            return;
        }

        try {
            await createUser(user, username, name, weight, imageUrl);
        } catch (error) {
            console.log(error);
        }
        setIsClickable(true);
        navigation.navigate("Profile");
    }

    return (
        <View style={{backgroundColor:'white', flex: 1}}>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.header}> Hey there! </Text>
                    <Text style={styles.subheader}> Let's get you set up </Text>
                </View>
                <Image style={styles.image} source={imageUrl==null ? image : {url: imageUrl}}/>
                <TouchableOpacity style={styles.button} onPress={pickImage}>
                    <Text style={styles.buttonText}> Add a profile photo </Text>
                </TouchableOpacity>
                <View style={styles.miniContainer}>
                    <TextInput style={styles.input} placeholder="Enter a username" onChangeText={setUsername}/>
                    <TextInput style={styles.input} placeholder="Enter your name" onChangeText={setName}/>
                    <TextInput style={styles.input} placeholder="Enter your weight" onChangeText={setWeight}/>
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
        justifyContent: 'flex-start', 
        alignItems: 'flex-start',
        gap: 25, 
        display: 'flex',
        marginVertical: '5%',
        width: '92%'
    },
    input: {
        borderRadius: 16,
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

export default Onboarding;