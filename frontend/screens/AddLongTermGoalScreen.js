// add long term goal screen

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { textStyles, containerStyles } from '../styles/styles';
import { useAuth } from "../contexts/AuthContext";
import { addGoal } from '../backendFunctions';

const AddLongTermGoalScreen = ({navigation}) => {
    const [goalName, setGoalName] = useState('');
    const [description, setDescription] = useState('');
    const [isClickable, setIsClickable] = useState(true);

    const {user} = useAuth();

    // function to add the entered goal to the backend
    const handleNewGoal = async () => {
        setIsClickable(false);
        const id = await addLongTermGoal(user, goalName, description);
        if (!id) {
            setIsClickable(true);
            Alert.alert("Error adding goal. Try again");
        }
        else {
            setGoalName('');
            setDescription('');
            setIsClickable(true);
            navigation.navigate("Goals");
        }
    }

    return (
        <View style={containerStyles.background}>
            <View style={containerStyles.container}>
                <View style={containerStyles.headerContainer}>
                    <Text style={textStyles.header}> Add a Long Term Goal </Text>
                </View>
                <TextInput
                    style={containerStyles.textInput}
                    placeholder="Goal Name"
                    value={goalName}
                    onChangeText={setGoalName}
                />
                <TextInput
                    style={containerStyles.textInput}
                    placeholder="Description"
                    value={description}
                    onChangeText={setDescription}
                />
                <TouchableOpacity style={containerStyles.purpleButton} onPress={handleNewGoal}>
                    <Text style={textStyles.textBodyHeaderWhite}> Add Goal </Text>
                </TouchableOpacity>

                <View style={containerStyles.buttonContainer}>
                    <TouchableOpacity style={containerStyles.whiteButton} onPress={() => navigation.navigate("AddGoal")}>
                        <Text style={textStyles.textBodyHeader}> Back </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={containerStyles.purpleButton} onPress={handleNewGoal} disabled={!isClickable}>
                        <Text style={textStyles.textBodyHeaderWhite}> Submit </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

export default AddLongTermGoalScreen;