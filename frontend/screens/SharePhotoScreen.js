// lets you share the progress after you take a photo using TakePhotoScreen.js

import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext.js";
import { fetchGroupImages, fetchRecentGroupImages, addImageToDatabase, addToBucket } from '../backendFunctions.js';
import { View, Image, TouchableOpacity, Text, FlatList, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, RefreshControl, Platform, Modal } from 'react-native';
import { CheckBox } from '@react-native-community/checkbox';
import { useNavigation } from '@react-navigation/native';
import { containerStyles, textStyles } from '../styles/styles.js';
import { addProgress } from '../backendFunctions.js';
import { useRoute } from '@react-navigation/native';
import { fetchUserGoals } from '../backendFunctions';
import * as FileSystem from 'expo-file-system';

import checkBoxImage from '../assets/check.png';

const SharePhotoScreen = ({navigation}) => {
    const route = useRoute();

    const [caption, setCaption] = useState('');
    const [goals, setGoals] = useState([]);
    const [imageData, setImageData] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');

    const [filteredGoals, setFilteredGoals] = useState([]);

    const [selectedGoals, setSelectedGoals] = useState(['']);

    const { imageUrl } = route.params;
              
    const { user } = useAuth();
    
    const [goalID, setGoalID] = useState(null);
    const [groupID, setGroupID] = useState(null);

    const [toggleCheckBox, setToggleCheckBox] = useState(false);

    useEffect(() => {
      fetchGoals(); // Fetch goals when the component is mounted
    }, []);

    const fetchGoals = async () => {
      const goals = await fetchUserGoals(user); // Fetch the goals from the backend
      console.log("in fetch goals");
      console.log(goals);
      setGoals(goals); // Set the goals to the state
      console.log("after set goals");
      console.log(goals);

      // add some stuff to extract only the name from each goal
      const goalNames = goals.map((goal) => goal.name);
      setGoals(goalNames);
      console.log("after set goal names" + goalNames);
    };
    
    // upload the image
    const uploadImage = async () => {
      console.log("imageurl: " + imageUrl);
      if (imageUrl) {
        const image = await FileSystem.readAsStringAsync(imageUrl, { encoding: FileSystem.EncodingType.Base64 });
        console.log("image: " + image);
        const url = await addToBucket(image);
        console.log("url: " + url);
        console.log("caption: " + caption);
        console.log("goals: " + goals);
        console.log("user: " + user);
        console.log("groupID: " + groupID);
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

    const handleSearch = (text) => {
      console.log(text);
      setSearchTerm(text);
      // find the goals that match the search term
      const filtered = goals.filter((goal) => goal.toLowerCase().includes(text.toLowerCase()));
      setFilteredGoals(filtered);
      console.log("filtered shit" + filtered);
    };

    const toggleGoalSelection = (goal) => {
      console.log(" top of toggling" + selectedGoals);
      if (selectedGoals.includes(goal)) {
        setSelectedGoals((prevSelectedGoals) => prevSelectedGoals.filter((item) => item !== goal));
      } else {
        setSelectedGoals((prevSelectedGoals) => [...prevSelectedGoals, goal]);
      }
    };

    return (
      <View style={containerStyles.background}>
        <View style={containerStyles.container}>
          <View style={containerStyles.headerContainer}>
            <Text style={textStyles.header}>
              Share Your Photo!
            </Text>
          </View>
          <View style={containerStyles.imageContainer}>
            <Image style={styles.image} source={{ uri: imageUrl }} />
            <TextInput 
                style={containerStyles.captionInput} 
                multiline // Add this prop to make it multiline
                value={caption} 
                onChangeText={setCaption} 
                placeholder="Add a caption..." 
            />          
          </View>
          <View style={containerStyles.divider}></View>
          <Text style={styles.goalHeader}>Select at least one goal associated with the photo:</Text>
          <TextInput
            style={{ borderWidth: 1, borderRadius:'10%', borderColor: 'gray', padding: 10, marginVertical: '2%', width: '100%'}}
            placeholder="🔍 Search goals..."
            value={searchTerm}
            onChangeText={handleSearch}
          />
          <FlatList
            data={filteredGoals}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => toggleGoalSelection(item)}>
                <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', padding: 10, justifyContent: 'space-between' }}>
                  <Text>{item}</Text>
                  {selectedGoals.includes(item) ? (
                    <Image
                      source={checkBoxImage} // Image for selected state
                      style={{ width: 24, height: 24, backgroundColor: 'black', borderColor: 'gray', borderWidth: 1}}
                    />
                  ) : (
                    <Image
                      source={checkBoxImage} // Image for unselected state
                      style={{ width: 24, height: 24, backgroundColor: 'white', borderColor: 'gray', borderWidth: 1}}
                    />
                  )}
                  {console.log("selected goals: " + selectedGoals)}
                </View>
                <View style={containerStyles.goalDivider}></View>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={containerStyles.whiteButton} onPress={() => navigation.navigate("ConfirmPhoto", {imageUrl: imageUrl})}>
              <Text>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={containerStyles.purpleButton} onPress={uploadImage}>
              <Text style={textStyles.textBodySmallWhite}>Share!</Text>
            </TouchableOpacity>
          </View>
        </View>
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
        flexDirection: 'row',
        gap: '10%',
      },
      image: {
        width: '45%',
        height: 150,
        borderRadius: 10,
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
        marginBottom: '2%',
        marginTop: '5%',
      },
      goal: {
        fontSize: 16,
        marginBottom: 5,
      },
    });
    
    export default SharePhotoScreen;