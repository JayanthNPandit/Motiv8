import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import loadFonts from '../fonts/loadFonts';
import image from '../assets/working-out-2.png';

const GroupsScreen = ({navigation}) => {

  useEffect(() => loadFonts(), []);

    return (
      <View style={{backgroundColor:'white', flex: 1}}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Find Your Friends</Text>
            <Text style={styles.subheader}>Motiv8 Group Options</Text>
          </View>
          <Image style={styles.image} source={image}/>
          <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate("CreateGroup")}>
            <Text style={styles.createButtonText}> Create a group </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.joinButton} onPress={() => navigation.navigate("JoinGroup")}>
            <Text style={styles.joinButtonText}> Join a group </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}> 
            <Text style={{...styles.textBodySmall, textDecorationLine: 'underline'}}> Skip </Text> 
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
  // HEADER CONTAINER STYLING
  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '5%',
    gap: 8
  },
  header: {
    color: 'black', 
    fontSize: 24, 
    fontFamily: 'Poppins-Bold',
  },
  subheader: {
    color: '#8692A6',
    fontSize: 16,
    fontFamily: 'Poppins',
    fontWeight: '400',
    lineHeight: 28
  },
  // IMAGE STYLING
  image: {
    width: '97%',
    height: '30%',
  },
  // CREATE BUTTON STYLING
  createButton: {
    display: 'flex',
    justifyContent: 'center', 
    alignItems: 'center',
    paddingVertical: '4.5%',
    paddingHorizontal: '28%',
    backgroundColor: '#4044AB',
    borderRadius: 62, 
    gap: 10,
    marginVertical: '4%'
  },
  createButtonText: {
    color: 'white', 
    fontSize: 14, 
    fontFamily: 'Poppins', 
    fontWeight: '400',
    lineHeight: 24,
  },
  // JOIN BUTTON STYLING
  joinButton: {
    display: 'flex',
    justifyContent: 'center', 
    alignItems: 'center',
    paddingVertical: '4.5%',
    paddingHorizontal: '30%',
    backgroundColor: 'white',
    borderRadius: 62, 
    borderWidth: 1,
    gap: 10,
    marginVertical: '4%'
  },
  joinButtonText: {
    color: 'black', 
    fontSize: 14, 
    fontFamily: 'Poppins', 
    fontWeight: '400'
  },
  // SKIP BUTTON
  textBodySmall: {
    color: '#545454',
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: '400'
  },
})

export default GroupsScreen;