import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import Checkbox from 'expo-checkbox';
import image from '../assets/default-pfp.png';

import loadFonts from '../fonts/loadFonts';

const Onboarding = ({navigation}) => {

    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [weight, setWeight] = useState("");

    useEffect(() => {
        // Load fonts when the app starts
        loadFonts();
    }, []);

    return (
        <View style={{backgroundColor:'white', flex: 1}}>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.header}> Hey there! </Text>
                    <Text style={styles.subheader}> Let's get you set up </Text>
                </View>
                <Image source={image}/>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}> Add a profile photo </Text>
                </TouchableOpacity>
                <View style={styles.miniContainer}>
                    <TextInput style={styles.input} placeholder="Enter a username" onChange={setUsername}/>
                    <TextInput style={styles.input} placeholder="Enter your name" onChange={setName}/>
                    <TextInput style={styles.input} placeholder="Enter your weight" onChange={setWeight}/>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.backButton}>
                        <Text style={styles.backButtonText}> Back </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}> Next </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginHorizontal: '5%',
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
    // SIGN IN BUTTON STYLING
    button: {
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center',
        paddingVertical: '4%',
        paddingHorizontal: '15%',
        backgroundColor: '#4044AB',
        borderRadius: 31, 
        gap: 10,
        marginVertical: '5%'
    },
    buttonText: {
        color: 'white', 
        fontSize: 14, 
        fontFamily: 'Poppins', 
        fontWeight: '400'
    },
    // INPUT CONTAINER STYLING
    miniContainer: {
        flexDirection: 'column', 
        justifyContent: 'flex-start', 
        alignItems: 'flex-start',
        gap: 25, 
        display: 'flex',
        marginVertical: '5%',
        width: '92%'
    },
    input: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#9A9A9A',
        width: '100%', 
        paddingHorizontal: '2%',
        paddingVertical: '4.5%',
    },
    // BUTTON CONTAINER
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    // BACK BUTTON
    backButton: {
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center',
        paddingVertical: '4%',
        paddingHorizontal: '15%',
        backgroundColor: 'white',
        borderRadius: 62, 
        borderWidth: 1,
        gap: 10,
        marginVertical: '4%'
    },
    backButtonText: {
        color: 'black', 
        fontSize: 14, 
        fontFamily: 'Poppins', 
        fontWeight: '400'
    },
});

export default Onboarding;