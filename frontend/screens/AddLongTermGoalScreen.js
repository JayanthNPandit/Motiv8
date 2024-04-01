// add recurring goal screen

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { textStyles, containerStyles } from '../styles/styles';
import { useAuth } from "../contexts/AuthContext";
import { addGoal } from '../backendFunctions';

const AddLongTermGoalScreen = ({navigation}) => {
    const [goalName, setGoalName] = useState('');
    const [type, setType] = useState('Long Term');
    const [frequency, setFrequency] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [isClickable, setIsClickable] = useState(true);

    const {user} = useAuth();

    const frequencies = ['Daily', 'Weekly', 'Monthly'];

    // function to add the entered goal to the backend
    const handleNewGoal = async () => {
        setIsClickable(false);
        const id = await addRecurringGoal(user, goalName, frequency, description);
        if (!id) {
            setIsClickable(true);
            Alert.alert("Error adding goal. Try again");
        }
        else {
            setGoalName('');
            setFrequency('');
            setDescription('');
            setIsClickable(true);
            navigation.navigate("Goals");
        }
    }

    const toggleFrequency = (frequency) => {
        const newSelection = frequencies.includes(frequency)
          ? frequencies.filter((selected) => selected !== frequency)
          : [...frequencies, frequency];
    
        setFrequency(frequency);
      }

    return (
        <View style={containerStyles.background}>
            <View style={containerStyles.container}>
                <View style={containerStyles.headerContainer}>
                    <Text style={textStyles.header}> Add a Long Term Goal </Text>
                    <Text style={textStyles.textBodyGray}>You can always change this later! </Text>
                </View>

                <View style={containerStyles.inputContainer}>

                    <Text style={textStyles.textBodyHeader}> Enter a name for your goal: </Text>
                    <TextInput style={containerStyles.input} value={goalName} onChangeText={setGoalName}/>

                    <Text style={textStyles.textBodyHeader}> Choose a goal type: </Text>
                    <TextInput style={containerStyles.input} value={type} onChangeText={setType} editable={false}/>

                    <Text style={textStyles.textBodyHeader}> Set a target date: </Text>
                    <TextInput style={containerStyles.input} value={date} onChangeText={setDate}/>

                    <Text style={textStyles.textBodyHeader}> Add a description: </Text>
                    <TextInput style={containerStyles.biggerInput} value={description} onChangeText={setDescription} placeholder='This is optional'/>

                    <View style={containerStyles.buttonContainer}>
                        <TouchableOpacity style={containerStyles.bigWhiteButton} onPress={() => navigation.navigate("AddGoal")}>
                            <Text style={textStyles.textBodyHeader}> Back </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={containerStyles.purpleButton} onPress={handleNewGoal} disabled={!isClickable}>
                            <Text style={textStyles.textBodyHeaderWhite}> Submit </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    // IMAGE STYLING
    image: {
        width: '75%',
        height: '30%',
        margin: '5%'
    },frequencyButton: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        margin: 5,
        backgroundColor: 'transparent',
      },
      selectedButton: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        margin: 5,
        backgroundColor: 'darkpurple',
      },
});


export default AddLongTermGoalScreen;