// page to edit all your goals

// Path: GroupGoals/frontend/screens/EditGoalScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, FlatList } from 'react-native';
import { textStyles, containerStyles } from '../styles/styles';
import { useAuth } from "../contexts/AuthContext";
import { addGoal, getUser, editGoal, fetchUserGoals } from '../backendFunctions';

const EditGoalScreen = ({navigation, route}) => {
    const [goalName, setGoalName] = useState('');
    const [type, setType] = useState('Recurring');
    const [frequency, setFrequency] = useState('');
    const [counter, setCounter] = useState(1);
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [isClickable, setIsClickable] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [completedGoals, setCompletedGoals] = useState([]);
    const [inProgressGoals, setInProgressGoals] = useState([]);

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
        filterGoals(goals); // Filter the goals into completed and in progress goals
    };

    const filterGoals = (goals) => {
        const inProgress = [];
        const completed = [];
        goals.forEach((goal) => {
          if (goal === "Recurring") {
            recurring.push([goal.name, goal.currentCounter, goal.counter]);
          } else if (goal.type === "Long Term") {
            longTerm.push(goal.name);
          } else
          {
            console.log("Other goal type");
          }
        });
        setRecurringGoals(recurring);
        setLongTermGoals(longTerm);
    
        console.log("Long term goals before pinning: " + longTermGoals);
    
        // remove the pinned goal from the long-term goals list if it is there
        if (pinned) {
          setLongTermGoals(prevLongTermGoals => prevLongTermGoals.filter(item => item !== pinnedGoal));
        }
    
        console.log("Recurring goals: " + recurringGoals);
        console.log("Long term goals after pinning: " + longTermGoals);
        console.log("Pinned goal: " + pinnedGoal);
        console.log("Pinned goal description: " + pinnedGoalDescription);
    };

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

    const handleSearch = (text) => {
        console.log(text);
        setSearchTerm(text);
        // find the goals that match the search term
        const filtered = goals.filter((goal) => goal.toLowerCase().includes(text.toLowerCase()));
        setFilteredGoals(filtered);
        console.log("filtered shit" + filtered);
    }

    return (
        <View style={containerStyles.background}>
            <View style={containerStyles.container}>
                <View style={containerStyles.headerContainer}>
                    <Text style={textStyles.header}> All Your Goals </Text>
                    <Text style={textStyles.textBodyGray}>Open Goal Dropdown to Edit </Text>
                </View>
                <Text style={styles.goalHeader}>Select at least one goal associated with the photo:</Text>
                <TextInput
                    style={{ borderWidth: 1, borderRadius:'10%', borderColor: 'gray', padding: 10, marginVertical: '2%', width: '100%'}}
                    placeholder="🔍 Search goals..."
                    value={searchTerm}
                    onChangeText={handleSearch}
                />

                <Text style={textStyles.sectionHeader}> Your Goals in Progress </Text>

                <Text style={textStyles.sectionHeader}> Your Completed Goals </Text>
            </View>
        </View>
    );
}

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

export default EditGoalScreen;