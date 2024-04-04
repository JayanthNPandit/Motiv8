import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ScrollView, RefreshControl } from 'react-native';
import { textStyles, containerStyles } from '../styles/styles';
import addButton from '../assets/zondicons_add-solid.png';
import backgroundImage from '../assets/Fitz Personal Training.png';
import dropDownImage from '../assets/lets-icons_arrow-drop-down.png';
import takePhotoButton from '../assets/gg_check-o.png';
import editGoalButton from '../assets//gay.png';
import { fetchUserGoals } from '../backendFunctions';
import { useAuth } from '../contexts/AuthContext';


const GoalsScreen = ({navigation}) => {
  const {user} = useAuth();

  const [showList, setShowList] = useState(false); // State to manage whether to show the list or not

  const [goals, setGoals] = useState([""]); // State to store the goals
  const [recurringGoals, setRecurringGoals] = useState([]);
  const [longTermGoals, setLongTermGoals] = useState([]);

  const [refreshing, setRefreshing] = useState(false); // State to manage refreshing the list 

  const exampleGoals = [
    'Run 5 miles',
    'Read 50 pages',
    'Drink 8 cups of water',
    'Meditate for 10 minutes',
    'Complete a coding challenge',
    'Cook a new recipe',
    'Write in a journal',
  ];

  const pinnedGoal = 'Run 5 miles';

  const exampleLongTermGoals = [ 'Complete a marathon', 'Learn to play the guitar', 'Travel to Japan' ];

  useEffect(() => {
    fetchGoals(); // Fetch goals when the component is mounted
  }, []);

  const fetchGoals = async () => {
    const goals = await fetchUserGoals(user); // Fetch the goals from the backend
    console.log("in fetch goals");
    console.log(goals);
    setGoals(goals); // Set the goals to the state
    console.log("after set goals");
    filterGoals(goals); // Filter the goals into recurring and long-term goals
    setRefreshing(false); // Set refreshing to false
  }

  const filterGoals = (goals) => {
    const recurring = [];
    const longTerm = [];
    goals.forEach((goal) => {
      if (goal.type === "Recurring") {
        recurring.push(goal.name);
      } else if (goal.type === "Long Term") {
        longTerm.push(goal.name);
      } else
      {
        console.log("Other goal type");
      }
    });
    setRecurringGoals(recurring);
    setLongTermGoals(longTerm);

    console.log("Recurring goals: " + recurringGoals);
    console.log("Long term goals: " + longTermGoals);
  }

  const onRefresh = () => {
    setRefreshing(true); // Start refreshing
    fetchGoals(); // Fetch goals again
  }

  return (
    <View style={containerStyles.background}>
      <ScrollView style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={containerStyles.container}>
          <View style={containerStyles.buttonContainer}>
            <View style={containerStyles.goalsHeaderContainer}>
              <Text style={textStyles.header}>Goals</Text>
                <TouchableOpacity style={containerStyles.greenButton} onPress={() => navigation.navigate("AddGoal")}>
                    <Image source={addButton} style={{width: 35, height: 35}}/>
                </TouchableOpacity>
            </View> 
          </View>
          <View style={containerStyles.pinnedGoalContainer}>
              <Text style={textStyles.textBodyHeaderWhite}>Pinned Goal:</Text>
              <Text style={textStyles.goalText}>{pinnedGoal}</Text>
          </View>
          <View style={containerStyles.goalsButtonContainer}>
            <View style={containerStyles.headerContainer}>
              <Text style={textStyles.sectionHeader}>Goals for the Week:</Text>
            </View> 
              <Image source={dropDownImage} style={{width: 20, height: 20}}/>
          </View>
          <View style={containerStyles.goalsButtonContainer}>
            <View style={styles.itemContainer}>
              <ScrollView horizontal={true} pagingEnabled={true}>
                {recurringGoals.map((goal, index) => (
                  <View key={index} style={containerStyles.recurringGoalContainer}>
                    <Text style={textStyles.goalText}>{goal}</Text>
                    <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("TakePhoto")}>
                      <Image source={editGoalButton} style={{width: 20, height: 20}}/>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={containerStyles.divider}></View>

          <View style={containerStyles.listContainer}>
            <Text style={textStyles.sectionHeader}>Long-Term Goals:</Text>
              <View style={containerStyles.buttonContainer}>
                {longTermGoals.length == 0 ? (
                  <Image source={backgroundImage} style={styles.backgroundImage} />
                ) : (
                  <FlatList
                    data={longTermGoals}
                    renderItem={({ item }) => (
                      <TouchableOpacity onPress={() => navigation.navigate("TakePhoto")}>
                        <View style={containerStyles.longTermGoalContainer}>
                          <Text style={textStyles.blackGoalText}>{item}</Text>
                          <Image source={takePhotoButton} style={{width: 20, height: 20}}/>
                        </View>
                      </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.id}
                  />
                )}
              </View>
          </View>
        </View>
      </ScrollView>
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
});

export default GoalsScreen;
