import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { textStyles, containerStyles } from '../styles/styles';
import addButton from '../assets/zondicons_add-solid.png';
import backgroundImage from '../assets/Fitz Personal Training.png';
import dropDownImage from '../assets/lets-icons_arrow-drop-down.png';

const GoalsScreen = ({navigation}) => {
  const [goals, setGoals] = useState([]);

  const [showList, setShowList] = useState(false); // State to manage whether to show the list or not


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

  const longTermGoals = [ 'Complete a marathon', 'Learn to play the guitar', 'Travel to Japan' ];

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
    <View style={containerStyles.background}>
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

        <View style={containerStyles.buttonContainer}>
          <View style={containerStyles.headerContainer}>
            <Text style={textStyles.sectionHeader}>Goals for the Week:</Text>
          </View> 
            <Image source={dropDownImage} style={{width: 20, height: 20}}/>
        </View>

        <View style={containerStyles.buttonContainer}>
          <View style={styles.itemContainer}>
            <ScrollView horizontal={true}>
              {exampleGoals.map((goal, index) => (
                <View key={index} style={containerStyles.goalContainer}>
                  <Text style={textStyles.goalText}>{goal}</Text>
                  <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("TakePhoto")}>
                    <Image source={addButton} style={{width: 20, height: 20}}/>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>

        <View style={containerStyles.listContainer}>
          <View style={containerStyles.divider}></View>
          <Text style={textStyles.sectionHeader}>Long-Term Goals:</Text>
          {longTermGoals.length != 0 ? (
            <Image source={backgroundImage} style={styles.backgroundImage} />
          ) : (
            <FlatList
              data={longTermGoals}
              renderItem={({ item }) => (
                <Text
                  title={item.title}
                  checked={item.checked}
                  onCheck={() => toggleCheckbox(item.id)}
                />
              )}
              keyExtractor={(item) => item.id}
            />
          )}
        </View>
      </View>
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
