import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import loadFonts from '../fonts/loadFonts';

const ForgotPasswordScreen = ({navigation}) => {

    const [email, setEmail] = useState("");
    const [isClickable, setIsClickable] = useState(true);

    const { resetPassword, resetError } = useAuth();

    useEffect(() => { loadFonts(); }, []);
    
    const handleReset = async () => {
        if (email === '') {
            Alert.alert('Please type in your email so that we can send a password reset email. Then click "Forgot password?"');
            return;
        }
        setIsClickable(false);
        await resetPassword(email);
        if (resetError) {
            Alert.alert('Encountered an error, try again.');
            setIsClickable(false);
        } else {
            Alert.alert('Sent a password reset email. It may take a few minutes to send.');
            setEmail('');
            setIsClickable(false);
            navigation.navigate("Login");
        }
    }
    
    return (
        <View style={{backgroundColor:'white', flex: 1}}>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.header}> Forgot Password </Text>
                    <Text style={styles.subheader}> Follow the steps below. </Text>
                </View>

                <View style={styles.miniContainer}>
                    <Text style={styles.body}> Enter Email: </Text>
                    <TextInput style={styles.input} onChangeText={setEmail}/>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Login")} disabled={!isClickable}>
                        <Text style={styles.backButtonText}> Back </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleReset} disabled={!isClickable}>
                        <Text style={styles.buttonText}> Submit </Text>
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
        marginTop: '25%',
        marginBottom: '15%',
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
    // INPUT CONTAINER STYLING
    miniContainer: {
        flexDirection: 'column', 
        justifyContent: 'flex-start', 
        alignItems: 'flex-start',
        gap: 10, 
        display: 'flex',
        marginBottom: '5%',
        width: '92%'
    },
    body: {
        color: 'black',
        fontSize: 16,
        fontFamily: 'Inter',
        fontWeight: '500'
    },
    input: {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#939393',
        width: '100%', 
        paddingHorizontal: '2%',
        paddingVertical: '4.5%',
    },
    // SUBMIT BUTTON STYLING
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
    // BUTTON CONTAINER
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
})

export default ForgotPasswordScreen;