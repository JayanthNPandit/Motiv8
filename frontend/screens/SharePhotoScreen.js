// lets you share the progress after you take a photo using TakePhotoScreen.js

import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext.js";
import { fetchGroupImages, fetchRecentGroupImages, addImageToDatabase, addToBucket } from '../backendFunctions.js';
import { View, Image, TouchableOpacity, Text, FlatList, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, RefreshControl, Platform, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { containerStyles, textStyles } from '../styles/styles.js';
import { addProgress } from '../backendFunctions.js';

const SharePhotoScreen = ({navigation, imageUrl}) => {
    const [caption, setCaption] = useState('');
    const [goals, setGoals] = useState([]);
    const [imageData, setImageData] = useState([]);
    
    const [selectedImage, setSelectedImage] = useState(null);
            
    const { user } = useAuth();
    
    const [goalID, setGoalID] = useState(null);
    const [groupID, setGroupID] = useState(null);
    
    const navigation = useNavigation();

    
    // upload the image
    const uploadImage = async () => {
        if (imageUrl) {
          const image = await FileSystem.readAsStringAsync(imageUrl, { encoding: FileSystem.EncodingType.Base64 });
          const url = await addToBucket(image);
          const id = await addImageToDatabase(user, groupID, caption, url, goals);
          if (!id) {
            Alert.alert("Error uploading image. Try again");
          }
          else {
            setCaption('');
            setGoals([]);
            navigation.navigate("Feed");
          }
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
    
                <View style={containerStyles.buttonContainer}>
                    <Image style={styles.image} source={{uri: imageUrl}}/>
                    <TextInput style={containerStyles.input} value={caption} onChangeText={setCaption} defaultValue='Set a caption'/>
                </View>
                <View style={containerStyles.buttonContainer}>
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

export default SharePhotoScreen;
