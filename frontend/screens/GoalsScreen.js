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

// Fetch goals from endpoint
const fetchGoals = async () => {
    try {
        const response = await fetch('fetchGoalsEndpoint');
        const data = await response.json();
        setGoals(data.goals);
    } catch (error) {
        console.error('Error fetching goals:', error);
    }
}
    

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
    <View style={styles.container}>
      <Text style={styles.header}>Current Goals:</Text>
      <FlatList
        data={goals}
        renderItem={({ item }) => (
          <View style={styles.ellipse}>
            <Text style={styles.goalText}>{item}</Text>
            <TouchableOpacity style={styles.button}>
              <MaterialIcons name="check" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <TouchableOpacity style={styles.addButton} onPress={addGoal}>
        <MaterialIcons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>        
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  ellipse: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'black',
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 10,
  },
  goalText: {
    color: 'white',
    fontSize: 16,
  },
  button: {
    backgroundColor: 'transparent',
    padding: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'green',
    borderRadius: 50,
    padding: 10,
  },
});


export default GoalsScreen;