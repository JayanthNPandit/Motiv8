// add recurring goal screen

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { textStyles, containerStyles } from '../styles/styles';
import { useAuth } from "../contexts/AuthContext";
import { addGoal } from '../backendFunctions';
import { Calendar } from 'react-native-calendars';

const AddLongTermGoalScreen = ({navigation}) => {
    const [goalName, setGoalName] = useState('');
    const [type, setType] = useState('Long Term');
    const [frequency, setFrequency] = useState('');
    const [date, setDate] = useState('Set a target date');
    const [description, setDescription] = useState('');
    const [isClickable, setIsClickable] = useState(true);

    const {user} = useAuth();

    const frequencies = ['Daily', 'Weekly', 'Monthly'];

    const [showCalendar, setShowCalendar] = useState(false);

    // function to add the entered goal to the backend
    const handleNewGoal = async () => {
        setIsClickable(false);
        const id = await addGoal(user, goalName, type, frequency, date, description);
        if (!id) {
            setIsClickable(true);
            console.log("Error adding goal. Try again");
        }
        else {
            setGoalName('');
            setFrequency('');
            setDescription('');
            setIsClickable(true);
        }

        navigation.navigate("Goals");
    }

    const toggleShowCalendar = () => {
        setShowCalendar(!showCalendar);
    }

    return (
        <View style={containerStyles.background}>
            <View style={containerStyles.container}>
                <View style={containerStyles.headerContainer}>
                    <Text style={textStyles.header}> Add a Long Term Goal </Text>
                    <Text style={textStyles.textBodyGray}>You can always change this later! </Text>
                </View>

                <View style={containerStyles.purpleInputContainer}>
                    <Text style={textStyles.textBodyHeader}> Enter a name for your goal: </Text>
                    <TextInput style={containerStyles.input} value={goalName} onChangeText={setGoalName} />

                    <Text style={textStyles.textBodyHeader}> Choose a goal type: </Text>
                    <TextInput style={containerStyles.input} value={type} onChangeText={setType} editable={false}/>

                    <Text style={textStyles.textBodyHeader}> Add a description: </Text>
                    <TextInput style={containerStyles.biggerInput} value={description} onChangeText={setDescription} placeholder='This is optional' />

                    <Text>    </Text>

                    <TouchableOpacity onPress={() => toggleShowCalendar()}>
                        <View style={containerStyles.datePicker}>
                            <TextInput style={containerStyles.dateInput} value={date} onChangeText={setDate} editable={false}/>
                        </View>
                    </TouchableOpacity>

                    {/* Render the calendar as an overlay */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={showCalendar}
                        onRequestClose={() => setShowCalendar(false)}
                    >
                        <View style={containerStyles.modalContainer}>
                            <View style={containerStyles.modalContent}>
                                <Calendar
                                    current={date}
                                    minDate={new Date()} // Set minimum date to today
                                    onDayPress={(day) => {
                                        setDate(day.dateString); // Update selected date
                                        setShowCalendar(false); // Close the calendar
                                    }}
                                />
                            </View>
                        </View>
                    </Modal>

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