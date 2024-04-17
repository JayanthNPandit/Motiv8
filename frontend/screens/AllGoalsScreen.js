import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { collection, getDocs } from 'firebase/firestore'; // Assuming you are using Firebase Firestore

const AllGoalsScreen = () => {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const goalsCollection = collection(db, 'goals'); // Adjust this to your database schema
        const snapshot = await getDocs(goalsCollection);
        const goalsData = snapshot.docs.map(doc => doc.data());
        setGoals(goalsData);
      } catch (error) {
        console.error('Error fetching goals:', error);
      }
    };

    fetchGoals();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>All Goals</Text>
      <View style={styles.goalsContainer}>
        {goals.map((goal, index) => (
          <View key={index} style={styles.goalContainer}>
            <Text style={styles.goalText}>{goal.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  goalsContainer: {
    width: '80%',
    alignItems: 'center',
  },
  goalContainer: {
    backgroundColor: 'purple',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  goalText: {
    color: 'white',
    fontSize: 18,
  },
});

export default AllGoalsScreen;
