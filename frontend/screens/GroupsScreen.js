import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { textStyles, containerStyles } from '../styles/styles';
import image from '../assets/working-out-2.png';
import { useAuth } from "../contexts/AuthContext";

const GroupsScreen = ({navigation}) => {


  const { user } = useAuth();

    return (
      <View style={containerStyles.background}>
        <View style={containerStyles.container}>
          <View style={containerStyles.headerContainer}>
            <Text style={textStyles.header}>Find Your Friends</Text>
            <Text style={textStyles.textBodyGray}>Motiv8 Group Options</Text>
          </View>
          <Image style={styles.image} source={image}/>
          <TouchableOpacity style={{...containerStyles.longPurpleButton, paddingHorizontal: '30%'}} onPress={() => navigation.navigate("CreateGroup")}>
            <Text style={textStyles.textBodyHeaderWhite}> Create a group </Text>
          </TouchableOpacity>
          <TouchableOpacity style={{...containerStyles.longWhiteButton, paddingHorizontal: '32%'}} onPress={() => navigation.navigate("JoinGroup")}>
            <Text style={textStyles.textBodyHeader}> Join a group </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}> 
            <Text style={{...textStyles.textBodySmallUnderline, color: "#8E99AB"}}> Skip </Text> 
          </TouchableOpacity>
        </View>
      </View>
    );
};

const styles = StyleSheet.create({
  // IMAGE STYLING
  image: {
    width: '75%',
    height: '30%',
    margin: '5%'
  }
})

export default GroupsScreen;