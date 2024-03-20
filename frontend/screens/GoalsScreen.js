import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import loadFonts from '../fonts/loadFonts';
import image from '../assets/working-out.png';


const GoalsScreen = () => {
    const [goals, setGoals] = useState([]);

    useEffect(() => {
        // Fetch the user's goals from the server
        const fetchGoals = async () => {
            try {
                // Replace 'fetchGoalsEndpoint' with the actual endpoint to fetch the user's goals
                const response = await fetch('fetchGoalsEndpoint');
                const data = await response.json();
                setGoals(data.goals);
            } catch (error) {
                console.error('Error fetching goals:', error);
            }
        };

        fetchGoals();
    }, []);

    // Add goal button
    const addGoal = () => {
        // Add a new goal to the user's goals
        const newGoal = 'New goal';
        setGoals([...goals, newGoal]);
    };

    // Sort the goals by type with finished goals at the bottom and unfinished ones on top
    const sortedGoals = [...goals].sort((a, b) => {
        if (a.completed && !b.completed) {
            return 1; // a is finished, b is unfinished, so a should come after b
        } else if (!a.completed && b.completed) {
            return -1; // a is unfinished, b is finished, so a should come before b
        } else {
            return 0; // both goals have the same completion status, so maintain the original order
        }
    });

    return (
        <View>
            {sortedGoals.map((goal, index) => (
                <Text key={index}>{goal}</Text>
            ))}
        </View>
    );
    // This just displays the user's goals
};

export default GoalsScreen;