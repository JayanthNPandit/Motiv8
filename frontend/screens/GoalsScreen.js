import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ScrollView, RefreshControl, Animated, Dimensions } from 'react-native';
import { textStyles, containerStyles } from '../styles/styles';
import addButton from '../assets/GoalAdd.png';
import backgroundImage from '../assets/Fitz Personal Training.png';
import dropDownImage from '../assets/lets-icons_arrow-drop-down.png';
import takePhotoButton from '../assets/gg_check-o.png';
import editGoalButton from '../assets//gay.png';
import menuButton from '../assets/f7_menu.png'; 
import pinButton from '../assets/pin.png';
import removeButton from '../assets/pin.png';

import { fetchUserGoals } from '../backendFunctions';
import { useAuth } from '../contexts/AuthContext';



const GoalsScreen = ({navigation}) => {
  const {user} = useAuth();

  const [showList, setShowList] = useState(false); // State to manage whether to show the list or not

  const [goals, setGoals] = useState([""]); // State to store the goals
  const [recurringGoals, setRecurringGoals] = useState([]);
  const [longTermGoals, setLongTermGoals] = useState([]);

  const [pinnedGoal, setPinnedGoal] = useState(); // State to store the pinned goal
  const [pinnedGoalDescription, setPinnedGoalDescription] = useState(); // State to store the pinned goal description
  const [pinned, setPinned] = useState(false); // State to manage whether a goal is pinned or not

  const [refreshing, setRefreshing] = useState(false); // State to manage refreshing the list 

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
      if (goal.completed === false) {
        if (goal.type === "Recurring") {
          recurring.push([goal.name, goal.currentCounter, goal.counter]);
        } else if (goal.type === "Long Term" && pinnedGoal !== goal.name) {
          longTerm.push(goal.name);
        } else
        {
          console.log("Other goal type");
        }
      }
    });
    setRecurringGoals(recurring);
    setLongTermGoals(longTerm);

    console.log("Recurring goals: " + recurringGoals);
    console.log("Long term goals: " + longTermGoals);
    console.log("Pinned goal: " + pinnedGoal);
    console.log("Pinned goal description: " + pinnedGoalDescription);
    console.log("screen width: " + screenWidth);  
  }

  const setPin = (goal) => {
    // Put the current pinned goal back into the long-term goals list only if there is already something pinned
    if (pinned) {
      setLongTermGoals(prevLongTermGoals => [...prevLongTermGoals, pinnedGoal]);
    }
  
    // Set pinned goal to the new goal
    setPinnedGoal(goal);
  
    // Set the description of the pinned goal
    const pinnedGoalDescription = goals.find(item => item.name === goal)?.description || 'No Description...';
    setPinnedGoalDescription(pinnedGoalDescription);
  
    // Set the pinned status
    setPinned(true);
  
    // Remove the goal from the long-term goals list
    setLongTermGoals((prevPinnedGoals) => prevPinnedGoals.filter((item) => item !== goal));
  };
  
  const removePin = () => {
    // Put the current pinned goal back into the long-term goals list only if there is already something pinned
    if (pinned) {
      setLongTermGoals(prevLongTermGoals => [...prevLongTermGoals, pinnedGoal]);
    }
  
    // Reset pinned goal and description
    setPinnedGoal(null);
    setPinnedGoalDescription(null);
  
    // Set pinned status
    setPinned(false);
  };  

  const onRefresh = () => {
    setRefreshing(true); // Start refreshing
    fetchGoals(); // Fetch goals again
  }

  const calculateProgress = (completed, total) => {
    return Math.round((completed / total) * 100);
  }

  const [activeIndex, setActiveIndex] = useState(0);
  const { width: screenWidth } = Dimensions.get('window');

  const scrollViewRef = useRef();

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);
    setActiveIndex(index);
  };

  return (
    <View style={containerStyles.background}>
      <ScrollView style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={containerStyles.container}>
          <View style={containerStyles.goalsHeaderContainer}>
            <Text style={textStyles.header}>Goals</Text>
          </View>

          <TouchableOpacity
            style={{position: 'absolute', right: '-1%', top: '-2%'}}
            onPress={() => navigation.navigate("AddGoal")}
          >
            <Image source={addButton} style={{width: 45, height: 45}}/>
          </TouchableOpacity>

          <View style={containerStyles.pinnedGoalsContainer}>
            {pinned ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={textStyles.textBodyHeaderWhiteBold}>{pinnedGoal}</Text>
                  <Text style={textStyles.goalText}>{pinnedGoalDescription}</Text>
                </View>
                <TouchableOpacity onPress={removePin}>
                  <Image source={pinButton} style={{ width: 20, height: 20 }} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={textStyles.textBodyHeaderWhite}>No pinned goals</Text>
                </View>
                <TouchableOpacity onPress={removePin}>
                  <Image source={pinButton} style={{ width: 20, height: 20 }} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <Text style={textStyles.sectionHeader}>Goals for the Week:</Text>

          <View style={{...containerStyles.background, marginTop: '2%'}}>
          {recurringGoals.length == 0 ? (
            <View style={[containerStyles.recurringGoalContainer, {width: 0.9*screenWidth}]}>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${Math.min(100)}%` }]} />
              </View>
              <View style={containerStyles.goalContentContainer}>
                <Text style={[textStyles.goalText, { flexShrink: 1 }]} numberOfLines={undefined}>No goals yet!</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddGoal")}>
                  <Image source={editGoalButton} style={{ width: 20, height: 20 }} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <ScrollView
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              //marginBottom={"-42%"}
              // nothing
            >
              {/* figure out wtf is wrong with this container sizing thing at EM*/ }
              {/* also figure out pinned goals backend stuff*/ }
              {recurringGoals.map((item) => (
                <View style={[containerStyles.recurringGoalContainer, {width: 0.9*screenWidth}]}>
                  <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBar, { width: `${Math.min(100, calculateProgress(item[2] - item[1], item[2]))}%` }]} />
                  </View>
                  <View style={containerStyles.goalContentContainer}>
                    <Text style={[textStyles.goalText, { flexWrap: 'wrap', flexShrink: 1 }]}>{item[0]}</Text>
                    <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("EditRecurringGoal", { goalName: item[0].toString() })}>
                      <Image source={editGoalButton} style={{ width: 20, height: 20, marginLeft: '1%' }} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
          </View>

          <View style={styles.pagination}>
            {recurringGoals.map((key, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.dot, { backgroundColor: index === activeIndex ? 'black' : 'lightgray' }]}
                onPress={() => scrollViewRef.current.scrollTo({ x: screenWidth * index, animated: true })}
              />
            ))}
          </View>

          <View style={containerStyles.divider}></View>

          <View style={containerStyles.menuContainer}>
            <Text style={textStyles.sectionHeader}>Long-Term Goals:</Text>

            <TouchableOpacity onPress={() => navigation.navigate(goals.length != 0 ? "AllGoals" : "AddGoal")}>
              <Text style={{ textDecorationLine: 'underline', color: 'lightgray', position: 'absolute', left: 30, bottom: 5 }}> View All </Text>
            </TouchableOpacity>
          </View>

          <View style={{...containerStyles.buttonContainer, marginTop: '2%'}}>
            {longTermGoals.length === 0 ? (
              <View>
                <Image source={backgroundImage} style={styles.backgroundImage} />
                <TouchableOpacity onPress={() => navigation.navigate("AddGoal")}>
                  <View style={{...containerStyles.whiteButton, borderColor: '#8098D5', borderWidth: 2}}>
                    <Text style={textStyles.textBodyHeaderBlue}>Add a goal!</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                  data={longTermGoals}
                  nestedScrollEnabled={true}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <View style={containerStyles.longTermGoalContainer}>
                      <Text style={{...textStyles.textBody, color: '#8098D5'}}>{item}</Text>
                      <TouchableOpacity onPress={() => setPin(item)}>
                        <Image source={pinButton} style={{ width: 20, height: 20 }} />
                      </TouchableOpacity>
                    </View>
                  )}
                />
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
  goalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 20,
  },
  pagination: {
    flexDirection: 'row',
    marginTop: '5%',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 5,
    margin: 5,
  },
  button: {
    position: 'absolute',
    top: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'lightgray',
  },
  // New styles for progress bar
  progressBarContainer: {
    width: '100%',
    height: 10,
    backgroundColor: 'lightgray',
    borderRadius: 5,
    marginTop: '2%'
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 5,
  },
  goalContentContainer: {
    flexDirection: 'row', // Ensure text and image appear inline
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%', // Ensure full width to avoid stretching
    marginTop: 5,
  },
});

export default GoalsScreen;