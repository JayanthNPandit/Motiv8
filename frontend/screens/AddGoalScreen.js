import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { textStyles, containerStyles } from '../styles/styles';
import {Picker} from '@react-native-picker/picker';
import { useAuth } from "../contexts/AuthContext";
import { addGoal } from '../backendFunctions';

const AddGoalScreen = ({navigation}) => {
    const [goalName, setGoalName] = useState('');
    const [goalType, setGoalType] = useState('');
    const [frequency, setFrequency] = useState('');
    const [description, setDescription] = useState('');
    const [isClickable, setIsClickable] = useState(true);

    const {user} = useAuth();
  
    // Placeholder data for goal types and frequencies, you can replace these with your actual data
    const goalTypes = ['Recurring', 'Long Term'];
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
      <View style={containerStyles.background}>
        <View style={containerStyles.container}>
          <View style={containerStyles.headerContainer}>
            <Text style={textStyles.header}> Add a Goal </Text>
            <Text style={textStyles.textBodyGray}> You can always change this later! </Text>
          </View>

          <View style={styles.form}>
            <View style={containerStyles.inputContainer}>
              <Text style={textStyles.textBodyHeaderBold}>Enter a name for your goal:</Text>
              <TextInput 
                style={containerStyles.input} 
                onChangeText={setGoalName} 
                value={goalName} 
                placeholder="Your goal name"
              />
            </View>
            
            <View>
              <Text style={styles.label}>Choose a goal type:</Text>
              <Picker
                selectedValue={goalType}
                onValueChange={(itemValue, itemIndex) => setGoalType(itemValue)}
                style={styles.picker}>
                {goalTypes.map((type, index) => (
                  <Picker.Item key={index} label={type} value={type} />
                ))}
              </Picker>
            </View>
            
            {goalType === 'Recurring' && (
              <View>
                <Text style={styles.label}>Choose frequency:</Text>
                <Picker
                  selectedValue={frequency}
                  onValueChange={(itemValue, itemIndex) => setFrequency(itemValue)}
                  style={styles.picker}>
                  {frequencies.map((type, index) => (
                  <Picker.Item key={index} label={type} value={type} />
                ))}
                </Picker>
              </View>
            )}

            {goalType === 'Long term' && (
              <View>
                <Text style={styles.label}>Enter a date:</Text>
                <TextInput
                  style={styles.input}
                  value={longTermDate}
                  onChangeText={text => setLongTermDate(text)}
                  placeholder="MM-DD-YYYY"
                  keyboardType="numeric"
                />
              </View>
            )}

            <View style={containerStyles.inputContainer}>
              <Text style={textStyles.textBodyHeaderBold}>Add a description:</Text>
              <TextInput 
                style={containerStyles.input} 
                onChangeText={setDescription} 
                value={description} 
                placeholder="This is optional"
              />
            </View>
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
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    },
    picker: {
      width: '100%',
    }
})
  
  export default AddGoalScreen;