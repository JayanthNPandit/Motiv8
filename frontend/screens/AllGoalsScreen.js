import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { collection, getDocs } from 'firebase/firestore'; // Assuming you are using Firebase Firestore
import { fetchUserGoals, deleteGoal } from '../backendFunctions';
import { useAuth } from '../contexts/AuthContext';
import { textStyles, containerStyles } from '../styles/styles';
import back from "../assets/back_arrow.png";


const AllGoalsScreen = ({navigation}) => {
  const [goals, setGoals] = useState([]);

  const [refreshing, setRefreshing] = useState(false); // State to manage refreshing the list 
  const [searchTerm, setSearchTerm] = useState(null);
  // make expanded for boht in progress and completed
  const [expandedGoalIndexInProgress, setExpandedGoalIndexInProgress] = useState([]);
  const [expandedGoalIndexCompleted, setExpandedGoalIndexCompleted] = useState([]);


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
    // if the index is in the array, remove it. other wise, add it
    if (expandedGoalIndex.includes(index)) {
      setExpandedGoalIndex(expandedGoalIndex.filter((i) => i !== index));
    } else {
      // figure out if the index is in the in progress or completed goals and add that to the expanded list
      setExpandedGoalIndex([...expandedGoalIndex, index]);
    }
  }

  // make 2 functions to handle, one for in progress and one for completed
  const handleGoalContainerPressInProgress = (index) => {
    // if the index is in the array, remove it. other wise, add it
    if (expandedGoalIndexInProgress.includes(index)) {
      setExpandedGoalIndexInProgress(expandedGoalIndexInProgress.filter((i) => i !== index));
    } else {
      setExpandedGoalIndexInProgress([...expandedGoalIndexInProgress, index]);
    }
  }

  const handleGoalContainerPressCompleted = (index) => {
    // if the index is in the array, remove it. other wise, add it
    if (expandedGoalIndexCompleted.includes(index)) {
      setExpandedGoalIndexCompleted(expandedGoalIndexCompleted.filter((i) => i !== index));
    } else {
      setExpandedGoalIndexCompleted([...expandedGoalIndexCompleted, index]);
    }
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

  // delete goal
  const handleDelete = async (goalName) => {
    // Show confirmation alert
    Alert.alert(
      'Delete Goal',
      `Are you sure you want to delete the goal "${goalName}"?`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await deleteGoal(user, goalName); // Assuming deleteGoal function deletes the goal from Firestore
              console.log('Goal deleted successfully!');
              // Refresh goals after deletion
              fetchGoals();
            } catch (error) {
              console.error('Error deleting goal: ', error);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };


  return (
    <View style={containerStyles.background}>
      <ScrollView style={styles.scrollView} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={containerStyles.container}>
        <TouchableOpacity style={containerStyles.back} onPress={() => navigation.navigate("Goals")}>
          <Image source={back} />
        </TouchableOpacity>
        <Text style={textStyles.header}>All Your Goals</Text>
        <Text style={textStyles.subheader}>Open Goal Dropdown to Edit</Text>
        <TextInput
          style={{ borderWidth: 1, borderRadius:10, borderColor: 'gray', padding: 10, marginVertical: '2%', marginHorizontal: '2%', width: '100%' }}
          placeholder="🔍 Search goals..."
          value={searchTerm}
          onChangeText={handleSearch}
        />
        <View style={styles.goalsContainer}>
          {/* If searchTerm is null, split goals into in progress and completed */}
          {searchTerm === null ? (
            <View>
              <View>
                <Text style={styles.sectionHeader}>In Progress: </Text>
                {inProgressGoals.map((goal, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleGoalContainerPressInProgress(index)}
                  >
                    <View style={styles.goalContainer}>
                      <Text style={styles.goalText}>{goal.name}</Text>
                      {expandedGoalIndexInProgress.includes(index) && (
                        <View style={styles.goalDetailsContainer}>
                          <Text>Type: {goal.type}</Text>
                          {goal.type === "Recurring" ? (
                            <Text>Frequency: {goal.frequency}</Text>
                          ) : (
                            <Text>Target Date: {goal.date}</Text>
                          )}
                          <Text>Description: {goal.description}</Text>
                          <View style={flexDirection='row'}>
                          <TouchableOpacity onPress={() => navigation.navigate(goal.type === "Recurring" ? "EditRecurringGoal" : "EditLongTermGoal", { goalName: goal.name})}>
                            <Text>Edit</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => handleDelete(goal.name)}>
                            <Text>Delete</Text>
                          </TouchableOpacity>
                          </View>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.divider}></View>
              <View>
                <Text style={styles.sectionHeader}>Completed: </Text>
                {completedGoals.map((goal, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleGoalContainerPressCompleted(index)}
                  >
                    <View style={styles.goalContainer}>
                      <Text style={styles.goalText}>{goal.name}</Text>
                      {expandedGoalIndexCompleted.includes(index) && (
                        <View style={styles.goalDetailsContainer}>
                          <Text>Type: {goal.type}</Text>
                          {goal.type === "Recurring" ? (
                            <Text>Frequency: {goal.frequency}</Text>
                          ) : (
                            <Text>Target Date: {goal.date}</Text>
                          )}
                          <Text>Description: {goal.description}</Text>
                          <View style={flexDirection='row'}>
                          <TouchableOpacity onPress={() => navigation.navigate(goal.type === "Recurring" ? "EditRecurringGoal" : "EditLongTermGoal", { goalName: goal.name})}>
                            <Text>Edit</Text>
                          </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate(handleDelete("" + goal.name))}>
                              <Text>Delete</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            <View>
              <Text style={styles.sectionHeader}>Filtered Goals</Text>
              <View style={styles.divider}></View>
              {filteredGoals.map((goal, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleGoalContainerPress(index)}
                >
                  <View style={styles.goalContainer}>
                    <Text>{goal}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        </View>
        <View style={{ flex: 1, paddingBottom: '10%' }}></View>
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
    alignItems: 'center',
    flexDirection: 'column',
  },
  goalContainer: {
    borderRadius: 5,
    borderWidth: '1%',
    borderColor: '#8098D5',
    width: '100%',
    paddingVertical: '2%',
    marginRight: '52%',
    marginVertical: '2%',
    textAlign: 'center',
    paddingLeft: '2%',
    backgroundColor: '#AABFF4',
  },
  goalDetailsContainer: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: '2%',
    marginRight: '2%',
    backgroundColor: '#F0F4FF',
    flexDirection: 'column',
  },
});

export default AllGoalsScreen;
