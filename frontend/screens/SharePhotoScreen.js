// lets you share the progress after you take a photo using TakePhotoScreen.js

import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext.js";
import { fetchGroupImages, fetchRecentGroupImages, addImageToDatabase, addToBucket } from '../backendFunctions.js';
import { View, Image, TouchableOpacity, Text, FlatList, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, RefreshControl, Platform, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { containerStyles, textStyles } from '../styles/styles.js';
import { addProgress } from '../backendFunctions.js';
import route from '../navigation/Route.js';

const SharePhotoScreen = ({navigation, imageUrl}) => {
    const [caption, setCaption] = useState('');
    const [goals, setGoals] = useState([]);
    const [imageData, setImageData] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');

    const [filteredGoals, setFilteredGoals] = useState([]);
              
    const { user } = useAuth();
    
    const [goalID, setGoalID] = useState(null);
    const [groupID, setGroupID] = useState(null);
    
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
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Share Progress</Text>
            <Text style={styles.subheader}>Share your progress with your group!</Text>
          </View>
    
          <View style={styles.buttonContainer}>
            <Image style={styles.image} source={{ uri: imageUrl }} />
            <TextInput
              style={styles.input}
              value={caption}
              onChangeText={setCaption}
              placeholder='Set a caption'
            />
          </View>
    
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder='Search goals...'
            />
          </View>
    
          {filteredGoals.length > 0 && (
            <View style={styles.buttonContainer}>
              <Text style={styles.goalHeader}>Choose a goal:</Text>
              <FlatList
                data={filteredGoals}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => addToGoals(item)}>
                    <Text style={styles.goal}>{item}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item}
              />
            </View>
          )}
    
          {/* Add your upload button and any other UI elements here */}
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
      },
      headerContainer: {
        marginBottom: 20,
      },
      header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
      },
      subheader: {
        fontSize: 16,
        color: 'gray',
      },
      buttonContainer: {
        marginBottom: 20,
      },
      image: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
      },
      input: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
      },
      searchContainer: {
        marginBottom: 20,
      },
      searchInput: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
      },
      goalHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
      },
      goal: {
        fontSize: 16,
        marginBottom: 5,
      },
    });
    
    export default SharePhotoScreen;