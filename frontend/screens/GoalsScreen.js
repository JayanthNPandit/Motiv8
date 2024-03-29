import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { textStyles, containerStyles } from '../styles/styles';
import addButton from '../assets/zondicons_add-solid.png';

const GoalsScreen = ({navigation}) => {
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
            <TouchableOpacity style={{...containerStyles.button}} onPress ={() => navigation.navigate("AddGoal")}>
              <Image name="check" size={'24%'} color="white" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <TouchableOpacity style={styles.addButton} onPress={navigation.navigate("")}>
        <Image onPress = {navigation.navigate("")}></Image>
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
