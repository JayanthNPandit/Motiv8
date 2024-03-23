import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { textStyles, containerStyles } from '../styles/styles';
import image from '../assets/working-out.png';

const WelcomeScreen = ({navigation}) => {

    return (
        <View style={containerStyles.background}>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={textStyles.title}>Motiv8.</Text>
                    <Text style={textStyles.textBodyGray}>Get motivated by your friends.</Text>
                </View>
                <Image style={styles.image} source={image}/>
                <TouchableOpacity style={containerStyles.longPurpleButton} onPress={() => navigation.navigate("SignUp")}>
                    <Text style={textStyles.textBodyHeaderWhite}> Signup </Text>
                </TouchableOpacity>
                <TouchableOpacity style={containerStyles.longWhiteButton} onPress={() => navigation.navigate("Login")}>
                    <Text style={textStyles.textBodyHeader}> Login </Text>
                </TouchableOpacity>
            </View>
        </View>
        
    );
}

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
    // HEADER STYLING
    headerContainer: {
        display: 'flex',
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'flex-start', 
        gap: 5, 
        marginHorizontal: '15%',
        marginVertical: '5%'
    },
    // IMAGE STYLING
    image: {
        width: '97%',
        height: '30%',
    },
})

export default WelcomeScreen;