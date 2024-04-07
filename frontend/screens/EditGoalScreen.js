// page to edit all your goals

// Path: GroupGoals/frontend/screens/EditGoalScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, FlatList } from 'react-native';
import { textStyles, containerStyles } from '../styles/styles';
import { useAuth } from "../contexts/AuthContext";
import { addGoal, getUser, editGoal } from '../backendFunctions';

const EditGoalScreen = ({navigation, route}) => {
    const [goalName, setGoalName] = useState('');
    const [type, setType] = useState('Recurring');
    const [frequency, setFrequency] = useState('');
    const [counter, setCounter] = useState(1);
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [isClickable, setIsClickable] = useState(true);

    const [dropdownVisible, setDropdownVisible] = useState(false);

    const {user} = useAuth();

    const frequencies = ['Day', 'Week', 'Month', 'Year'];

    // function to add the entered goal to the backend
    const handleEditGoal = async () => {

        setIsClickable(false);
        const id = await editGoal(user, goalName, type, frequency, date, description);
        console.log(id);

        if (!id) {
            setIsClickable(true);
            console.log("Error editing goal. Try again");
        }
        else {
            setGoalName('');
            setFrequency('');
            setDescription('');
            setIsClickable(true);
        }

        navigation.navigate("Goals");
    }

    const toggleFrequency = (frequency) => {
        setFrequency(frequency);
    }

    const FrequencyDropdown = () => {
        return (
            <FlatList
                data={frequencies}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => toggleFrequency(item)}>
                    <Text>{item}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item}
            />
        );
    }

    return (
        <View style={containerStyles.background}>
            <View style={containerStyles.container}>
                <View style={containerStyles.headerContainer}>
                    <Text style={textStyles.header}> Edit Goal </Text>
                    <Text style={textStyles.textBodyGray}>Edit your goal! </Text>
                </View>

                <View style={containerStyles.buttonContainer}>
                    <TextInput style={containerStyles.input} value={goalName} onChangeText={setGoalName} placeholder='Goal Name'/>
                    <TextInput style={containerStyles.input} value={description} onChangeText={setDescription} placeholder='Description'/>
                    <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)}>
                        <Text>{frequency}</Text>
                    </TouchableOpacity>
                    {dropdownVisible ? <FrequencyDropdown /> : null}
                    <TouchableOpacity style={containerStyles.button} onPress={handleEditGoal}>
                        <Text style={textStyles.buttonText}>Edit Goal</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

export default EditGoalScreen;