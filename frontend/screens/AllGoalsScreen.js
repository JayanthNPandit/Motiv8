import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { fetchUserGoals, deleteGoal } from "../backendFunctions";
import { useAuth } from "../contexts/AuthContext";
import back from "../assets/back_arrow.png";
import frequency from "../assets/frequency.png";
import calendar from "../assets/othercalendar.png";
import menu from "../assets/Vector.png";
import garbage from "../assets/garbage.png";
import edit from "../assets/gay.png";

import { textStyles, containerStyles } from "../styles/styles";

const AllGoalsScreen = ({ navigation }) => {
  const [goals, setGoals] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState(null);
  const [expandedGoalIndexInProgress, setExpandedGoalIndexInProgress] = useState([]);
  const [expandedGoalIndexCompleted, setExpandedGoalIndexCompleted] = useState([]);
  const [inProgressGoals, setInProgressGoals] = useState([]);
  const [completedGoals, setCompletedGoals] = useState([]);
  const [filteredGoals, setFilteredGoals] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    const goals = await fetchUserGoals(user);
    setGoals(goals);
    filterGoals(goals);
    setRefreshing(false);
  };

  const filterGoals = (goals) => {
    const inProgress = goals.filter(goal => !goal.completed);
    const completed = goals.filter(goal => goal.completed);
    setInProgressGoals(inProgress);
    setCompletedGoals(completed);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchGoals();
  };

  const handleGoalContainerPress = (index, type) => {
    const setter = type === "InProgress" ? setExpandedGoalIndexInProgress : setExpandedGoalIndexCompleted;
    setter(prevState => {
      if (prevState.includes(index)) {
        return prevState.filter(i => i !== index);
      } else {
        return [...prevState, index];
      }
    });
  };

  const handleSearch = (text) => {
    setSearchTerm(text.trim() === "" ? null : text);
  };

  const renderGoals = (goals, expandedIndex, onPress, type) => {
    return goals.map((goal, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => onPress(index, type)}
      >
        <View style={styles.goalContainer}>
          <View style={styles.topContainer}>
            <Text style={textStyles.textBodyBoldPurple}>{goal.name}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity onPress={() => handleDelete(goal.name)}>
                <Image source={garbage} style={{ width: 20, height: 20 }} />
              </TouchableOpacity>
              <Text>{'\t'}</Text>
              <TouchableOpacity onPress={() => navigation.navigate(goal.type === "Recurring" ? "EditRecurringGoal" : "EditLongTermGoal", { goalName: goal.name })}>
                <Image source={edit} style={{ width: 20, height: 20 }} />
              </TouchableOpacity>
            </View>
          </View>
          {expandedIndex.includes(index) && (
            <View style={styles.goalDetailsContainer}>
              {goal.type === "Recurring" ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image source={frequency} style={{ width: 20, height: 20, marginRight: 5 }} />
                  <Text style={textStyles.textBodyHeaderPurple}>{goal.frequency}, {goal.counter}x</Text>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image source={calendar} style={{ width: 20, height: 20, marginRight: 5 }} />
                  <Text style={textStyles.textBodyHeaderPurple}>{goal.date}</Text>
                </View>
              )}

              {goal.description !== "" ? 
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image source={menu} style={{ width: 20, height: 20, marginRight: 5, backgroundColor: 'purple' }} />
                  <Text style={textStyles.textBodyHeaderPurple}>{goal.description}</Text>
                </View> 
                : 
                null
              }  
            </View>        
          )}
        </View>
      </TouchableOpacity>
    ));
  };

  const handleDelete = async (goalName) => {
    Alert.alert(
      "Delete Goal",
      `Are you sure you want to delete the goal "${goalName}"?`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteGoal(user, goalName);
              console.log("Goal deleted successfully!");
              fetchGoals();
            } catch (error) {
              console.error("Error deleting goal: ", error);
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={{ flex: 1, paddingTop: "10%" }}></View>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>All Your Goals</Text>
          <Text style={styles.textBodyGray}>Open Dropdown to view goal</Text>
        </View>
        <TouchableOpacity style={styles.back} onPress={() => navigation.navigate("Goals")}>
          <Image source={back} />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Search goals..."
          value={searchTerm}
          onChangeText={handleSearch}
        />
        <View style={styles.goalsContainer}>
          {searchTerm === null ? (
            <View>
              <Text style={styles.sectionHeader}>In Progress:</Text>
              {renderGoals(inProgressGoals, expandedGoalIndexInProgress, handleGoalContainerPress, "InProgress")}
              <View style={styles.divider} />
              <Text style={styles.sectionHeader}>Completed:</Text>
              {renderGoals(completedGoals, expandedGoalIndexCompleted, handleGoalContainerPress, "Completed")}
            </View>
          ) : (
            <View>
              <Text style={styles.sectionHeader}>Filtered Goals</Text>
              <View style={styles.divider} />
              {goals
                .filter(goal => goal.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((goal, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleGoalContainerPress(index, "Filtered")}
                  >
                    <View style={styles.goalContainer}>
                      <Text>{goal.name}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "10%",
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: "5%",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
  textBodyGray: {
    color: "#808080",
  },
  back: {
    position: "absolute",
    top: '2%',
    left: '2%',
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "gray",
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  goalsContainer: {
    marginHorizontal: 10,
  },
  goalContainer: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#8098D5",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#AABFF4",
  },
  goalDetailsContainer: {
    marginTop: 5,
    padding: 10,
    backgroundColor: "#F0F4FF",
    borderRadius: 10,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    marginVertical: 10,
  },
});

export default AllGoalsScreen;
