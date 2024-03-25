import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { textStyles, containerStyles } from '../styles/styles';
import image from '../assets/working-out-2.png';
import { addGoal } from '../backendFunctions';

const AddGoalScreen = () => {
    const [goalName, setGoalName] = useState('');
    const [goalType, setGoalType] = useState('');
    const [frequency, setFrequency] = useState('');
    const [description, setDescription] = useState('');

    const {user} = useAuth();
  
    // Placeholder data for goal types and frequencies, you can replace these with your actual data
    const goalTypes = ['Short Term', 'Long Term', 'Habit'];
    const frequencies = ['Daily', 'Weekly', 'Monthly'];

    // function to add the entered goal to the backend
    const handleNewGoal = async () => {
        setIsClickable(false);
        const id = await addGoal(user, goalName, goalType, frequency, description);
        if (!id) {
            setIsClickable(true);
            Alert.alert("Error adding goal. Try again");
        }
        else {
            setGoalName('');
            setGoalType('');
            setFrequency('');
            setDescription('');
            setIsClickable(true);
            navigation.navigate("Goals");
        }
    }

  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Add a goal</Text>
        <Text style={styles.subtitle}>You can always change this later!</Text>
        
        <View style={styles.form}>
          <Text style={styles.label}>Enter a name for your goal:</Text>
          <TextInput 
            style={styles.input} 
            onChangeText={setGoalName} 
            value={goalName} 
            placeholder="Your goal name"
          />
          
          <Text style={styles.label}>Choose a goal type:</Text>
          <Picker
            selectedValue={goalType}
            onValueChange={(itemValue, itemIndex) => setGoalType(itemValue)}
            style={styles.picker}>
            {goalTypes.map((type, index) => (
              <Picker.Item key={index} label={type} value={type} />
            ))}
          </Picker>
          
          <Text style={styles.label}>Choose a frequency:</Text>
          <Picker
            selectedValue={frequency}
            onValueChange={(itemValue, itemIndex) => setFrequency(itemValue)}
            style={styles.picker}>
            {frequencies.map((freq, index) => (
              <Picker.Item key={index} label={freq} value={freq} />
            ))}
          </Picker>
          
          <Text style={styles.label}>Add a description:</Text>
          <TextInput 
            style={styles.textarea} 
            onChangeText={setDescription} 
            value={description} 
            placeholder="This is optional"
            multiline
          />
        </View>
  
        <View style={containerStyles.buttonContainer}>
            <TouchableOpacity style={containerStyles.whiteButton} onPress={() => navigation.navigate("Goals")} disabled={!isClickable}>
                <Text style={textStyles.textBodyHeader}> Back </Text>
            </TouchableOpacity>
            <TouchableOpacity style={containerStyles.purpleButton} onPress={handleNewGoal} disabled={!isClickable}>
                <Text style={textStyles.textBodyHeaderWhite}> Submit </Text>
            </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor:'white', 
        marginVertical: '20%',
        backgroundColor: 'white'
    },
    // IMAGE STYLING
    image: {
        width: '70%',
        height: '20%',
        margin: '15%'
    }
})
  
  export default AddGoalScreen;