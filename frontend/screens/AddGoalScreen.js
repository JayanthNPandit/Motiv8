import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { textStyles, containerStyles } from '../styles/styles';
import image from '../assets/working-out-2.png';

const GoalsScreen = ({navigation}) => {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    fetchGoals(); // Fetch goals from the backend when component mounts
  }, []);

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
    fontSize: '10%',
  },
  button: {
    backgroundColor: 'transparent',
    padding: '10%',
  },
  addButton: {
    position: 'absolute',
    bottom: '5%', // Adjust position to appear above the list of goals
    right: '10%',
    backgroundColor: 'green',
    borderRadius: '20%',
    padding: '5%',
  },
});

export default GoalsScreen;
