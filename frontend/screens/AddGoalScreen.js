import React, { useEffect, useState } from 'react';
import { Image, View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { textStyles, containerStyles } from '../styles/styles';
import {Picker} from '@react-native-picker/picker';
import { useAuth } from "../contexts/AuthContext";
import { addGoal } from '../backendFunctions';
import recurringImage from '../assets/amico.png';
import longTermImage from '../assets/rafiki.png';

const AddGoalScreen = ({navigation}) => {
    const [goalName, setGoalName] = useState('');
    const [goalType, setGoalType] = useState('');
    const [frequency, setFrequency] = useState('');
    const [description, setDescription] = useState('');
    const [isClickable, setIsClickable] = useState(true);

    const {user} = useAuth();

    const check = user.email;

    return (
      <View style={containerStyles.background}>
        <View style={containerStyles.container}>
          <View style={containerStyles.headerContainer}>
            <Text style={textStyles.header}> Add a Goal </Text>
          </View>
          <Text style={textStyles.textBodyGray}> Choose your Goal Type: </Text>
            <View style={containerStyles.listContainer}>
              <Text style={textStyles.sectionHeader}></Text>
              <Text style={textStyles.sectionHeader}></Text>
              <Image source={recurringImage} style={styles.image}/>
              <Text style={textStyles.textBodyGray}> For goals that you want to {'\n'} complete at a specific frequency </Text>
              <TouchableOpacity style={containerStyles.blackButton} onPress={() => navigation.navigate("AddRecurringGoal")}>
                <Text style={textStyles.textBodyHeaderWhite}> Add a Recurring Goal </Text>
              </TouchableOpacity>
            </View>

            <View style={containerStyles.divider}></View>

            <View style={containerStyles.listContainer}>
              <TouchableOpacity style={containerStyles.purpleButton} onPress={() => navigation.navigate("AddLongTermGoal")}>
                <Text style={textStyles.textBodyHeaderWhite}> Add a Long-Term Goal </Text>
              </TouchableOpacity>
              <Text style={textStyles.textBodyGray}> For goals where you want to {'\n'} achieve a certain milestone </Text>
              <Image source={longTermImage} style={styles.image}/>              
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