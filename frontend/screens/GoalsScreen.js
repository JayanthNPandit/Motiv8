import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ScrollView, RefreshControl, Animated, Dimensions } from 'react-native';
import { textStyles, containerStyles } from '../styles/styles';
import addButton from '../assets/zondicons_add-solid.png';
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
      if (goal.type === "Recurring") {
        recurring.push([goal.name, goal.currentCounter, goal.counter]);
      } else if (goal.type === "Long Term") {
        longTerm.push(goal.name);
      } else
      {
        console.log("Other goal type");
      }
    });
    setRecurringGoals(recurring);
    setLongTermGoals(longTerm);

    console.log("Long term goals before pinning: " + longTermGoals);

    // remove the pinned goal from the long-term goals list if it is there
    if (pinned) {
      setLongTermGoals(prevLongTermGoals => prevLongTermGoals.filter(item => item !== pinnedGoal));
    }

    console.log("Recurring goals: " + recurringGoals);
    console.log("Long term goals after pinning: " + longTermGoals);
    console.log("Pinned goal: " + pinnedGoal);
    console.log("Pinned goal description: " + pinnedGoalDescription);
  }

  const setPin = (goal) => {
    // Put the current pinned goal back into the long-term goals list only if there is already something pinned
    if (pinned) {
      setLongTermGoals(prevLongTermGoals => [...prevLongTermGoals, pinnedGoal]);
    }
  
    // Set pinned goal to the new goal
    setPinnedGoal(goal);
  
    // Set the description of the pinned goal
    const goalDescription = goals.find(item => item.name === goal)?.description || 'No Description...';
    setPinnedGoalDescription(goalDescription);

    // remove the pinned goal from the long-term goals list
    setLongTermGoals(prevLongTermGoals => prevLongTermGoals.filter(item => item !== goal));
  
    // Set the pinned status
    setPinned(true);
  }
  
  const removePin = () => {
    // Put the current pinned goal back into the long-term goals list only if there is already something pinned
    if (pinned) {
      setLongTermGoals(prevLongTermGoals => [...prevLongTermGoals, pinnedGoal]);
    }
  
    // Set pinned status
    setPinned(false);
  }

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
          <View style={containerStyles.goalsHeaderButtonContainer}>
            <View style={containerStyles.goalsHeaderContainer}>
              <Text style={textStyles.header}>Goals</Text>
                <TouchableOpacity style={containerStyles.greenButton} onPress={() => navigation.navigate("AddGoal")}>
                    <Image source={addButton} style={{width: 35, height: 35}}/>
                </TouchableOpacity>
            </View> 
          </View>
          <View style={containerStyles.pinnedGoalsContainer}>
            {pinned ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={textStyles.textBodyHeaderWhiteBold}>{pinnedGoal}</Text>
                  {pinnedGoalDescription && <Text style={textStyles.goalText}>{pinnedGoalDescription}</Text>}
                </View>
                <TouchableOpacity onPress={removePin}>
                  <Image source={pinButton} style={{ width: 20, height: 20 }} />
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={textStyles.textBodyHeaderWhite}>No pinned goals</Text>
            )}
          </View>
          <View style={containerStyles.goalsButtonContainer}>
            <View style={containerStyles.headerContainer}>
              <Text style={textStyles.sectionHeader}>Goals for the Week:</Text>
            </View> 
              <Image source={dropDownImage} style={{width: 20, height: 20, position: 'absolute', left: 225, bottom: 20}}/>
          </View>
          <View style={containerStyles.goalsButtonContainer}>
            <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {recurringGoals.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No goals yet!</Text>
                  <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("EditGoal")}>
                    <Image source={editGoalButton} style={{ width: 20, height: 20 }} />
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                  >
                    {recurringGoals.map((item, index) => (
                    <View key={index} style={[containerStyles.recurringGoalContainer, { width: screenWidth - 50 }]}>
                      <View style={styles.progressBarContainer}>
                        <View style={[styles.progressBar, { width: `${Math.min(100, calculateProgress(item[1]-2, item[2]))}%` }]} />
                      </View>
                      <View style={styles.goalContentContainer}>
                        <Text style={textStyles.goalText}>{item[0]}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("EditGoal")}>
                          <Image source={editGoalButton} style={{ width: 20, height: 20 }} />
                        </TouchableOpacity>
                      </View>
                    </View>
                    ))}
                  </ScrollView>
                </View>
              )}
            </ScrollView>
            </View>
            <View style={styles.pagination}>
              {recurringGoals.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.dot, { backgroundColor: index === activeIndex ? 'black' : 'lightgray' }]}
                  onPress={() => scrollViewRef.current.scrollTo({ x: screenWidth * index, animated: true })}
                />
              ))}
            </View>
          </View>

          <View style={containerStyles.divider}></View>

          <View style={containerStyles.listContainer}>
            <View style={containerStyles.menuContainer}>
              <Text style={textStyles.sectionHeader}>Long-Term Goals:</Text>
              <TouchableOpacity onPress={() => setShowList(!showList)}>
                <Text style={{ textDecorationLine: 'underline', color: 'lightgray', position: 'absolute', left: 30, bottom: 5 }}> View All </Text>
              </TouchableOpacity>
            </View>
            <View style={containerStyles.buttonContainer}>
              {longTermGoals.length === 0 ? (
                <View>
                  <Image source={backgroundImage} style={styles.backgroundImage} />
                  <TouchableOpacity onPress={() => navigation.navigate("AddGoal")}>
                    <View style={containerStyles.whiteButton}>
                      <Text style={textStyles.blackGoalText}>Add your first goal!</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  {showList ? (
                    <FlatList
                      data={longTermGoals}
                      renderItem={({ item }) => (
                        <View style={containerStyles.longTermGoalContainer}>
                          <Text style={textStyles.grayGoalText}>{item}</Text>
                          <TouchableOpacity onPress={() => setPin(item)}>
                            <Image source={pinButton} style={{ width: 20, height: 20 }} />
                          </TouchableOpacity>
                        </View>
                      )}
                      //keyExtractor={(item) => item.id}
                    />
                  ) : (
                    <FlatList
                      data={longTermGoals.slice(0, 3)} // Show only the first 3 goals
                      renderItem={({ item }) => (
                        <View style={containerStyles.longTermGoalContainer}>
                          <Text style={textStyles.grayGoalText}>{item}</Text>
                          <TouchableOpacity onPress={() => setPin(item)}>
                            <Image source={pinButton} style={{ width: 20, height: 20 }} />
                          </TouchableOpacity>
                        </View>
                      )}
                      //keyExtractor={(item) => item.id}
                    />
                  )}
                </>
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
    position: 'absolute',
    bottom: 16,
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
    height: 5,
    backgroundColor: 'lightgray',
    borderRadius: 5,
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
  },
});

export default GoalsScreen;
