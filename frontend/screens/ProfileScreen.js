import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { fetchUserData, changeUserData } from "../backendFunctions";
import { textStyles, containerStyles } from '../styles/styles';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import image from '../assets/default-pfp.png';

const ProfileScreen = ({navigation}) => {
    
    const [name, setName] = useState("");
    const [origName, setOrigName] = useState("");
    const [username, setUsername] = useState("");
    const [imageUrl, setImageUrl] = useState(null);
    const [edit, setEdit] = useState(false);
    const [isClickable, setIsClickable] = useState(true);
    
    const { user, logout } = useAuth();

    useEffect(() => {
        fetchUserData(user.uid)
        .then((data) => {
            setName(data.name);
            setOrigName(data.name);
            setUsername(data.username);
            setImageUrl(data.profilePicture);
            setEdit(false);
        })
    }, []);

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

    // logout function
    const handleLogout = async () => {
        setIsClickable(false);
        await logout();
        setIsClickable(true);
        navigation.navigate("Welcome");
    }

    // change data
    const handleChange = async () => {
        setIsClickable(false);
        await changeUserData(user, name, username, imageUrl);
        setOrigName(name);
        setIsClickable(true);
        setEdit(false);
    }

    // copied from
    return (
        <View style={containerStyles.background}>
            {!edit && (<View style={containerStyles.container}>
                <View style={containerStyles.headerContainer}>
                    <Text style={textStyles.header}> Hi, {origName}! </Text>
                    <Text style={textStyles.textBodyGray}> Let's view your profile </Text>
                </View>
                <Image style={styles.image} source={imageUrl=="" ? image : {url: imageUrl}}/>
                <View style={containerStyles.inputContainer}>
                    <Text style={textStyles.textBodyHeader}> Name </Text>
                    <TextInput style={containerStyles.input} value={name} editable={false}/>
                </View>
                <View style={containerStyles.inputContainer}>
                    <Text style={textStyles.textBodyHeader}> Username </Text>
                    <TextInput style={containerStyles.input} value={username} editable={false}/>
                </View>
                <TouchableOpacity style={{...containerStyles.longPurpleButton, paddingHorizontal: '25%', marginVertical: '2%'}}>
                    <Text style={{...textStyles.textBodySmall, color:'white'}}> View all your photos </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.editContainer} onPress={() => setEdit(true)}>
                    <Text style={{...textStyles.textBodyBoldPurple, textDecorationLine:'underline'}}>Edit Profile</Text>
                </TouchableOpacity>
            </View>)}

            {edit && (<View style={containerStyles.container}>
                <View style={containerStyles.headerContainer}>
                    <Text style={textStyles.header}> Hi, {origName}! </Text>
                    <Text style={textStyles.textBodyGray}> Let's edit your profile </Text>
                </View>
                <Image style={styles.image} source={imageUrl == "" ? image : {url: imageUrl}}/>
                <TouchableOpacity style={{...containerStyles.purpleButton, marginTop:'1%'}} onPress={pickImage}>
                    <Text style={{...textStyles.textBodySmall, color:'white'}}> Change your profile photo </Text>
                </TouchableOpacity>
                <View style={containerStyles.inputContainer}>
                    <Text style={textStyles.textBodyHeader}> Enter Name: </Text>
                    <TextInput style={containerStyles.input} value={name} onChangeText={setName}/>
                </View>
                <View style={containerStyles.inputContainer}>
                    <Text style={textStyles.textBodyHeader}> Enter Username: </Text>
                    <TextInput style={containerStyles.input} value={username} onChangeText={setUsername}/>
                </View>
                <TouchableOpacity style={{...containerStyles.purpleButton, marginTop:'1%'}} disabled={!isClickable} onPress={handleChange}>
                    <Text style={{...textStyles.textBodySmall, color:'white'}}> Save </Text>
                </TouchableOpacity>
            </View>)}
        </View>
    );
}

const styles = StyleSheet.create({
    editContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: '2%'
    },
    image: {
        width: '70%',
        height: '35%',
        borderRadius: 1000,
        marginVertical: '3%',
    },
});

export default ProfileScreen;