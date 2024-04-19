import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TextInput, TouchableOpacity } from 'react-native';
import { collection, getDocs } from 'firebase/firestore'; // Assuming you are using Firebase Firestore
import { fetchUserGoals } from '../backendFunctions';
import { useAuth } from '../contexts/AuthContext';
import { textStyles, containerStyles } from '../styles/styles';

const AllGoalsScreen = ({navigation}) => {
  const [goals, setGoals] = useState([]);

  const [refreshing, setRefreshing] = useState(false); // State to manage refreshing the list 
  const [searchTerm, setSearchTerm] = useState(null);
  const [expandedGoalIndex, setExpandedGoalIndex] = useState(null);


  const [inProgressGoals, setInProgressGoals] = useState([]); // State to manage in progress goals 
  const [completedGoals, setCompletedGoals] = useState([]); // State to manage completed goals
  const [filteredGoals, setFilteredGoals] = useState([]); // State to manage filtered goals

  const {user} = useAuth();

  useEffect(() => {
    fetchGoals(); // Fetch goals when the component is mounted
  }, []);

  const fetchGoals = async () => {
    const goals = await fetchUserGoals(user); // Assuming this function returns all goals
    setGoals(goals);

    filterGoals(goals);

    console.log("goals names: " + goals.map((goal) => goal.name));

    setRefreshing(false); // Set refreshing to false
  };

  const filterGoals = (goals) => {
    const inProgress = [];
    const completed = [];
    goals.forEach((goal) => {
      if (goal.completed === false) {
        inProgress.push(goal);
      }
      else
      {
        completed.push(goal);
      }
    });
    setInProgressGoals(inProgress);
    setCompletedGoals(completed);

    console.log("inProgress goal names" + inProgressGoals.map((goal) => goal.name));
    console.log("completed goal names" + completedGoals.map((goal) => goal.name));
  }

  const onRefresh = () => {
    setRefreshing(true); // Start refreshing
    fetchGoals(); // Fetch goals again
  }

  const handleGoalContainerPress = (index) => {
    setExpandedGoalIndex(index === expandedGoalIndex ? null : index);
  }

  const handleSearch = (text) => {
    console.log(text);
    setSearchTerm(text.trim() === '' ? null : text);
    // make a new list that only has the goal names
    const goalNames = goals.map((goal) => goal.name);
    // find the goals that match the search term
    const filtered = goalNames.filter((goal) => goal.toLowerCase().includes(text.toLowerCase()));
    setFilteredGoals(filtered);
    console.log("filtered shit" + filtered);
  };

  return (
    <View style={containerStyles.background}>
      <ScrollView style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View>   
          <Text style={textStyles.header}>All Your Goals</Text>
          <Text style={textStyles.subheader}>Open Goal Dropdown to Edit</Text>
          <TextInput
            style={{ borderWidth: 1, borderRadius:'10%', borderColor: 'gray', padding: 10, marginVertical: '2%', width: '100%'}}
            placeholder="🔍 Search goals..."
            value={searchTerm}
            onChangeText={handleSearch}
          />
          <View style={styles.goalsContainer}>
            {/* If searchTerm is null, split goals into in progress and completed */}
            {searchTerm === null ? (
            <>
              <View>
                <Text style={styles.sectionHeader}>In Progress</Text>
                {inProgressGoals.map((goal, index) => (
                  <TouchableOpacity key={index} onPress={() => handleGoalContainerPress(index)}>
                    <View style={styles.goalContainer}>
                      <Text style={styles.goalText}>{goal.name}</Text>
                      {expandedGoalIndex === index && (
                        <TextInput
                          value={goal.details} // Assuming details is the property containing additional details
                          onChangeText={(text) => handleGoalDetailsChange(index, text)} // Implement handleGoalDetailsChange function
                          placeholder="Edit details..."
                          style={styles.goalDetailsTextInput}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={containerStyles.divider}></View>
              <View>
                <Text style={styles.sectionHeader}>Completed</Text>
                {completedGoals.map((goal, index) => (
                  <TouchableOpacity key={index} onPress={() => handleGoalContainerPress(index)}>
                    <View style={styles.goalContainer}>
                      <Text style={styles.goalText}>{goal.name}</Text>
                      {expandedGoalIndex === index && (
                        <TextInput
                          value={goal.details} // Assuming details is the property containing additional details
                          onChangeText={(text) => handleGoalDetailsChange(index, text)} // Implement handleGoalDetailsChange function
                          placeholder="Edit details..."
                          style={styles.goalDetailsTextInput}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          ) : (
            // If searchTerm is not null, show filteredGoals
            <View>
              <Text style={styles.sectionHeader}>Filtered Goals</Text>
              <View style={containerStyles.divider}></View>
              {filteredGoals.map((goal, index) => (
                <TouchableOpacity key={index} onPress={() => handleGoalContainerPress(index)}>
                  <View style={styles.goalContainer}>
                    <Text style={styles.goalText}>{goal.name}</Text>
                    {expandedGoalIndex === index && (
                      <TextInput
                        value={goal.details} // Assuming details is the property containing additional details
                        onChangeText={(text) => handleGoalDetailsChange(index, text)} // Implement handleGoalDetailsChange function
                        placeholder="Edit details..."
                        style={styles.goalDetailsTextInput}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
          </View>
        </View>
      </ScrollView>
    </View>
  );    
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '10%', 
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: '5%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalsContainer: {
    width: '90%',
    alignItems: 'center',
    flexDirection: 'column',
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
