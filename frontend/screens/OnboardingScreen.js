import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { createUser } from "../backendFunctions";
import { deleteUser } from 'firebase/auth';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { textStyles, containerStyles } from '../styles/styles';
import image from '../assets/default-pfp.png';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { manipulateAsync } from 'expo-image-manipulator';
import { Camera } from 'expo-camera';

const Onboarding = ({navigation}) => {

    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [isClickable, setIsClickable] = useState(true);
    const [imageUrl, setImageUrl] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);

    const { user } = useAuth();

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
        setIsClickable(false);
        // test inputs
        if (username === '' || name === '') {
            Alert.alert('Please fill out all the fields');
            setIsClickable(true);
            return;
        }
        try {
            await createUser(user, username, name, imageUrl);
        } catch (error) {
            console.log(error);
        }
        setIsClickable(true);
        navigation.navigate("Groups");
    }

    return (
        <View style={containerStyles.background}>
            <View style={containerStyles.container}>
                <View style={containerStyles.headerContainer}>
                    <Text style={textStyles.header}> Hey there! </Text>
                    <Text style={textStyles.textBodyGray}> Let's get you set up </Text>
                </View>
                <Image style={styles.image} source={imageUrl==null ? image : {url: imageUrl}}/>
                <TouchableOpacity style={containerStyles.purpleButton} onPress={pickImage}>
                    <Text style={textStyles.textBodyHeaderWhite}> Add a profile photo </Text>
                </TouchableOpacity>
                <View style={styles.inputContainer}>
                    <TextInput style={containerStyles.input} placeholder="Enter a username" onChangeText={setUsername}/>
                    <TextInput style={containerStyles.input} placeholder="Enter your name" onChangeText={setName}/>
                </View>
                <View style={containerStyles.buttonContainer}>
                    <TouchableOpacity style={containerStyles.whiteButton} onPress={deleteUserAndTryAgain} disabled={!isClickable}>
                        <Text style={textStyles.textBodyHeader}> Back </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={containerStyles.purpleButton} onPress={addUserInfo} disabled={!isClickable}>
                        <Text style={textStyles.textBodyHeaderWhite}> Next </Text>
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
    // INPUT CONTAINER STYLING
    inputContainer: {
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
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
    // IMAGE
    image: {
        width: '80%',
        height: '40%',
        borderRadius: 2000,
        marginVertical: '5%'
    }
});

export default Onboarding;