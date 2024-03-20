import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';

import loadFonts from '../fonts/loadFonts';

const SignUpScreen = ({navigation}) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isClickable, setIsClickable] = useState(true);

    const { register, loginError } = useAuth();

    useEffect(() => { loadFonts(); }, []);
    
    const handleRegister = async () => {
        setIsClickable(false);

        await register(email, password);
        if (loginError) {
            Alert.alert('Enter a valid email and password.');
            setIsClickable(true);
        } else {
            setEmail('');
            setPassword('');
            setIsClickable(true);
            navigation.navigate("Onboarding");
        }
    }

    return (
        <View style={{backgroundColor:'white', flex: 1}}>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.header}> Sign Up </Text>
                    <Text style={styles.subheader}> Get Started with Motiv8 </Text>
                </View>

                <View style={styles.miniContainer}>
                    <Text style={styles.body}> Email: </Text>
                    <TextInput style={styles.input} onChangeText={setEmail}/>
                </View>
                <View style={styles.miniContainer}>
                    <Text style={styles.body}> Password: </Text>
                    <TextInput secureTextEntry={true} style={styles.input} onChangeText={setPassword}/>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={!isClickable}>
                    <Text style={styles.buttonText}> Register </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.signUpText}> Already have an account? Log in </Text>
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
        fontFamily: 'Poppins-Bold'
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
    },
    
})

export default SignUpScreen