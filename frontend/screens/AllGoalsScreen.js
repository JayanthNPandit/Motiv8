import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TextInput, TouchableOpacity, Image } from 'react-native';
import { collection, getDocs } from 'firebase/firestore'; // Assuming you are using Firebase Firestore
import { fetchUserGoals } from '../backendFunctions';
import { useAuth } from '../contexts/AuthContext';
import { textStyles, containerStyles } from '../styles/styles';
import back from "../assets/back_arrow.png";


const AllGoalsScreen = ({navigation}) => {
  const [goals, setGoals] = useState([]);

  const [refreshing, setRefreshing] = useState(false); // State to manage refreshing the list 
  const [searchTerm, setSearchTerm] = useState(null);
  const [expandedGoalIndex, setExpandedGoalIndex] = useState([]);


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
      setExpandedGoalIndex([...expandedGoalIndex, index]);
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
          style={{ borderWidth: 1, borderRadius:'10%', borderColor: 'gray', padding: 10, marginVertical: '2%', marginHorizontal: '2%', width: '100%' }}
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
                    onPress={() => handleGoalContainerPress(index)}
                  >
                    <View style={styles.goalContainer}>
                      <Text style={styles.goalText}>{goal.name}</Text>
                      {expandedGoalIndex.includes(index) && (
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
                            <TouchableOpacity onPress={() => console.log("Delete")}>
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
                    onPress={() => handleGoalContainerPress(index)}
                  >
                    <View style={styles.goalContainer}>
                      <Text style={styles.goalText}>{goal.name}</Text>
                      {expandedGoalIndex.includes(index) && (
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
                            <TouchableOpacity onPress={() => console.log("Delete")}>
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
