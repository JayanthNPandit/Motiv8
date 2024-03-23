import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons

const GoalsScreen = () => {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    fetchGoals(); // Fetch goals from the backend when component mounts
  }, []);

  // Function to fetch goals from the backend
  const fetchGoals = async () => {
    try {
      const response = await fetch('fetchGoalsEndpoint');
      const data = await response.json();
      setGoals(data.goals);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  // Add the new goal to the user's goals collection on the server
 const addGoal = async (newGoal) => {
    try {
      // Replace 'addGoalEndpoint' with the actual endpoint to add a goal
      const response = await fetch('addGoalEndpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ goal: newGoal }),
      });
      const data = await response.json();
      // Update the goals state with the new goal
      setGoals([...goals, data.goal]);
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  // Sort the goals by completion status
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
        data={sortedGoals}
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
      {/* Button to add a new goal */}
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
    bottom: 100, // Adjust position to appear above the list of goals
    right: 20,
    backgroundColor: 'green',
    borderRadius: 50,
    padding: 10,
  },
});

export default GoalsScreen;
