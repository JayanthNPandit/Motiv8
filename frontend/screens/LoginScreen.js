import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Checkbox from 'expo-checkbox';

import loadFonts from '../fonts/loadFonts';

const LoginScreen = ({navigation}) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSelected, setSelection] = useState(false);
    const [isClickable, setIsClickable] = useState(true);

    const { login, remember, resetPassword, loginError, resetError } = useAuth();

    useEffect(() => { loadFonts(); }, []);

    const handleLogin = async () => {
        setIsClickable(false);
        if (isSelected) await remember();
        await login(email, password);
        if (loginError) {
            Alert.alert('Entered incorrect credentials. Try again.');
            setIsClickable(true);
        } else {
            setEmail('');
            setPassword('');
            setSelection(false);
            setIsClickable(true);
            navigation.navigate("Profile");
        }
    }

    const handleReset = async () => {
        if (email === '') {
            Alert.alert('Please type in your email so that we can send a password reset email. Then click "Forgot password?"');
            return;
        }
        await resetPassword(email);
        if (resetError) {
            Alert.alert('Encountered error, please try again in a few minutes.');
        } else {
            Alert.alert('Sent a password reset email. It may take a few minutes to send.');
        }
    }

    return (
        <View style={{backgroundColor:'white', flex: 1}}>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.header}> Login </Text>
                    <Text style={styles.subheader}> Continue Your Journey </Text>
                </View>

                <View style={styles.miniContainer}>
                    <Text style={styles.body}> Email: </Text>
                    <TextInput style={styles.input} onChangeText={setEmail}/>
                </View>
                <View style={styles.miniContainer}>
                    <Text style={styles.body}> Password: </Text>
                    <TextInput secureTextEntry={true} style={styles.input} onChangeText={setPassword}/>
                </View>

                <View style={styles.forgotOrRememberContainer}>
                    <View style={styles.checkboxContainer}>
                        <Checkbox value={isSelected}
                                onValueChange={setSelection}
                                color={isSelected ? '#9FA1D1' : undefined}
                                style={styles.checkbox}/>
                        <Text style={styles.forgotOrRemember}> Remember me? </Text>
                    </View>
                    <TouchableOpacity onPress={handleReset} disabled={!isClickable}> 
                        <Text style={{...styles.forgotOrRemember, textDecorationLine: 'underline'}}> Forgot Password? </Text> 
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={!isClickable}>
                    <Text style={styles.buttonText}> Sign in </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                    <Text style={styles.signUpText}> Don't have an account? Sign up </Text>
                </TouchableOpacity>
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
    // REMEMBER ME / FORGOT PW CONTAINER STYLING
    forgotOrRememberContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '92%',
    },
    checkboxContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    checkbox: {
        borderColor: 'black',
        borderWidth: 1,
    },
    forgotOrRemember: {
        color: '#545454',
        fontSize: 14,
        fontFamily: 'Poppins',
        fontWeight: '400'
    },
    // SIGN UP TEXT
    signUpText: {
        color: '#8E99AB',
        fontSize: 14,
        fontFamily: 'Poppins',
        fontWeight: '400',
        textDecorationLine: 'underline'
    }
})

export default LoginScreen;