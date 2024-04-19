import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, Platform, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { textStyles, containerStyles } from '../styles/styles';
import { useAuth } from "../contexts/AuthContext";
import { addGoal } from '../backendFunctions';

const AddRecurringGoalScreen = ({ navigation }) => {
    const [goalName, setGoalName] = useState('');
    const [type, setType] = useState('Recurring');
    const [frequency, setFrequency] = useState('Daily');
    const [counter, setCounter] = useState('');
    const [description, setDescription] = useState('');
    const [isClickable, setIsClickable] = useState(true);
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const { user } = useAuth();

    const frequencyOptions = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

    // Function to handle adding a new goal
    const handleNewGoal = async () => {
        if (!goalName || !frequency || !counter) {
            Alert.alert("Name, frequency, and counter are required fields.");
            setIsClickable(true);
            return;
        }

        setIsClickable(false);
        const id = await addGoal(user, goalName, type, frequency, counter, '', description);

        if (!id) {
            setIsClickable(true);
            console.log("Error adding goal. Try again");
        } else {
            setGoalName('');
            setCounter('');
            setDescription('');
            setIsClickable(true);
        }

        navigation.navigate("Goals");
    }

    const handleOptionSelect = (option) => {
        setFrequency(option);
        setDropdownVisible(false); // Close the dropdown after selection
    };

    return (
        <ScrollView style={containerStyles.background}>
        <View style={containerStyles.background}>
            <View style={containerStyles.container}>
                <View style={containerStyles.headerContainer}>
                    <Text style={textStyles.header}>Add a Recurring Goal</Text>
                    <Text style={textStyles.textBodyGray}>You can always change this later!</Text>
                </View>

                <View style={containerStyles.purpleInputContainer}>
                    <Text style={textStyles.textBodyHeader}>Enter a name for your goal:</Text>
                    <TextInput
                        style={containerStyles.input}
                        value={goalName}
                        onChangeText={setGoalName}
                    />

                    <Text style={textStyles.textBodyHeader}>Choose a goal type:</Text>
                    <TextInput
                        style={containerStyles.input}
                        value={type}
                        onChangeText={setType}
                        editable={false}
                    />

                    <Text style={textStyles.textBodyHeader}>Choose a frequency:</Text>
                    <View style={containerStyles.buttonContainer}>
                        <TextInput
                            style={containerStyles.counterInput}
                            value={counter}
                            onChangeText={setCounter}
                            keyboardType="numeric"
                        />
                        <Text style={textStyles.textBodyHeader}>times per</Text>
                        <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)}>
                            <TextInput
                                style={containerStyles.frequencyInput}
                                value={counter}
                                onChangeText={setFrequency}
                                editable={false}
                                defaultValue='Frequency'
                            />
                        </TouchableOpacity>
                        {dropdownVisible && (
                            <View style={styles.dropdownContainer}>
                            {frequencyOptions.map((option, index) => (
                                <TouchableOpacity key={index} onPress={() => handleOptionSelect(option)} style={styles.option}>
                                <Text>{option}</Text>
                                </TouchableOpacity>
                            ))}
                            </View>
                        )}
                    </View>

                    <Text style={textStyles.textBodyHeader}>Add a description:</Text>
                    <TextInput
                        style={containerStyles.biggerInput}
                        multiline={true}
                        numberOfLines={4}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="This is optional"
                    />

                    <View style={containerStyles.buttonContainer}>
                        <TouchableOpacity
                            style={containerStyles.whiteButton}
                            onPress={() => navigation.navigate("AddGoal")}
                        >
                            <Text style={textStyles.textBodyHeaderPurple}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={containerStyles.purpleButton}
                            onPress={handleNewGoal}
                            disabled={!isClickable}
                        >
                            <Text style={textStyles.textBodyHeaderWhite}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
        <View style={{ flex: 1, paddingBottom: '50%' }}>
        </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    dropdownButton: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        margin: 5,
        backgroundColor: 'transparent',
    },
    picker: {
        flex: 1,
        height: 50, // Adjust as needed
        backgroundColor: 'white',
    },
});

export default AddRecurringGoalScreen;
