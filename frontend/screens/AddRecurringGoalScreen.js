// add recurring goal screen

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { textStyles, containerStyles } from '../styles/styles';
import { useAuth } from "../contexts/AuthContext";
import { addGoal } from '../backendFunctions';

const AddRecurringGoalScreen = ({navigation}) => {
    const [goalName, setGoalName] = useState('');
    const [frequency, setFrequency] = useState('');
    const [description, setDescription] = useState('');
    const [isClickable, setIsClickable] = useState(true);

    const {user} = useAuth();

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

    return (
        <View style={containerStyles.background}>
            <View style={containerStyles.container}>
                <View style={containerStyles.headerContainer}>
                    <Text style={textStyles.header}> Add a Recurring Goal </Text>
                </View>
                <TextInput
                    style={containerStyles.textInput}
                    placeholder="Goal Name"
                    value={goalName}
                    onChangeText={setGoalName}
                />
                <TextInput
                    style={containerStyles.textInput}
                    placeholder="Frequency"
                    value={frequency}
                    onChangeText={setFrequency}
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

    const styles = StyleSheet.create({
        // IMAGE STYLING
        image: {
            width: '75%',
            height: '30%',
            margin: '5%'
        }
    })
};

export default AddRecurringGoalScreen;