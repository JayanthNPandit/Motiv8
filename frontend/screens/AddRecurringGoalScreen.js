// add recurring goal screen

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, FlatList, Alert } from 'react-native';
import { textStyles, containerStyles } from '../styles/styles';
import { useAuth } from "../contexts/AuthContext";
import { addGoal, getUser } from '../backendFunctions';

const AddRecurringGoalScreen = ({navigation}) => {
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
    const handleNewGoal = async () => {
        if (!goalName || !frequency || !counter) {
            Alert.alert("Name, frequency, and counter are required fields.");
            setIsClickable(true);
            return;
        }
    
        setIsClickable(false);
        const id = await addGoal(user, goalName, type, frequency, counter, date, description);
    
        console.log(id);
    
        if (!id) {
            setIsClickable(true);
            console.log("Error adding goal. Try again");
        } else {
            setGoalName('');
            setFrequency('');
            setCounter(''); // Assuming you have a function like setCounter to clear the counter value
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
            dropdownVisible ? (
                <FlatList
                    data={frequencies}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => toggleFrequency(item)}>
                            <Text>{item}</Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    initialNumToRender={3} // Example value, adjust as needed
                    maxToRenderPerBatch={3} // Example value, adjust as needed
                    windowSize={3} // Example value, adjust as needed
                />
            ) : (
                <FlatList
                    renderItem={<Text>empty</Text>}
                    windowSize={3}
                />
            )
        );
    };

    return (
        <View style={containerStyles.background}>
            <View style={containerStyles.container}>
                <View style={containerStyles.headerContainer}>
                    <Text style={textStyles.header}> Add a Recurring Goal </Text>
                    <Text style={textStyles.textBodyGray}>You can always change this later! </Text>
                </View>

                <View style={containerStyles.purpleInputContainer}>
                    <Text style={textStyles.textBodyHeader}> Enter a name for your goal: </Text>
                    <TextInput style={containerStyles.input} value={goalName} onChangeText={setGoalName}/>

                    <Text style={textStyles.textBodyHeader}> Choose a goal type: </Text>
                    <TextInput style={containerStyles.input} value={type} onChangeText={setType} editable={false}/>

                    <Text style={textStyles.textBodyHeader}> Choose a frequency: </Text>
                    <View style={containerStyles.buttonContainer}>
                        <TextInput style={containerStyles.counterInput} value={counter} onChangeText={setCounter}/>

                        <Text style={textStyles.bottomText}> times per </Text>

                        <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)}>
                            <View style={containerStyles.frequencyInput}>
                                <Text>{frequency}</Text>
                                <Text>    </Text>
                                <FrequencyDropdown/>
                                <Text style={textStyles.arrowText}>{dropdownVisible ? '▲' : '▼'}</Text> 
                            </View>
                        </TouchableOpacity>
                        
                    </View>

                    <Text style={textStyles.textBodyHeader}> Add a description: </Text>
                    <TextInput style={containerStyles.biggerInput} multiline={false} numberOfLines={4} value={description} onChangeText={setDescription} placeholder='This is optional'/>

                    <View style={containerStyles.buttonContainer}>
                        <TouchableOpacity style={containerStyles.whiteButton} onPress={() => navigation.navigate("AddGoal")}>
                            <Text style={textStyles.textBodyHeaderPurple}> Back </Text>
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
      frequencyChoices: {
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: 'white',
      },
});


export default AddRecurringGoalScreen;