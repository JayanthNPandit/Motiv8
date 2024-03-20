import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import loadFonts from '../fonts/loadFonts';
import image from '../assets/working-out.png';

const WelcomeScreen = ({navigation}) => {
    
    useEffect(() => { loadFonts(); }, []);

    return (
        <View style={{backgroundColor:'white', flex: 1}}>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>Motiv8.</Text>
                    <Text style={styles.subheader}>Get motivated by your friends.</Text>
                </View>
                <Image style={styles.image} source={image}/>
                <TouchableOpacity style={styles.signinButton} onPress={() => navigation.navigate("SignUp")}>
                    <Text style={styles.signinButtonText}> Signup </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.loginButtonText}> Login </Text>
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
    header: {
      color: 'black', 
      fontSize: 48, 
      fontFamily: 'Poppins-Bold'
    },
    subheader: {
        color: '#8E99AB', 
        fontSize: 16, 
        fontFamily: 'Poppins', 
        fontWeight: '400'
    },
    // IMAGE STYLING
    image: {
        width: '97%',
        height: '30%',
    },
    // SIGN IN BUTTON STYLING
    signinButton: {
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center',
        paddingVertical: '4%',
        paddingHorizontal: '35%',
        backgroundColor: '#4044AB',
        borderRadius: 62, 
        gap: 10,
        marginVertical: '4%'
    },
    signinButtonText: {
        color: 'white', 
        fontSize: 16, 
        fontFamily: 'Poppins', 
        fontWeight: '400'
    },
    // LOGIN BUTTON STYLING
    loginButton: {
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center',
        paddingVertical: '4%',
        paddingHorizontal: '36%',
        backgroundColor: 'white',
        borderRadius: 62, 
        borderWidth: 1,
        gap: 10,
        marginVertical: '4%'
    },
    loginButtonText: {
        color: 'black', 
        fontSize: 16, 
        fontFamily: 'Poppins', 
        fontWeight: '400'
    }
})

export default WelcomeScreen;