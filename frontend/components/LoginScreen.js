import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Checkbox from 'expo-checkbox';

const LoginScreen = ({navigation}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSelected, setSelection] = useState(false);

    const { login, loginError } = useAuth();

    const handleLogin = () => {
        login(email, password);
        if (!loginError) navigation.navigate('Profile');
    }

    return (
        <View style={{backgroundColor:'white', flex: 1}}>
            <View style={styles.container}>

                <View style={styles.headerContainer}>
                    <Text style={styles.header}> Login </Text>
                    <Text style={styles.desc}> Continue Your Journey </Text>
                </View>

                <View style={styles.miniContainer}>
                    <Text style={styles.genericText}> Email: </Text>
                    <TextInput style={styles.input} onChange={setEmail}/>
                </View>
                <View style={styles.miniContainer}>
                    <Text style={styles.genericText}> Password: </Text>
                    <TextInput secureTextEntry={true} style={styles.input} onChange={setPassword}/>
                </View>

                <View style={styles.forgotOrRememberContainer}>
                    <View style={styles.checkboxContainer}>
                        <Checkbox value={isSelected}
                                onValueChange={setSelection}
                                color={isSelected ? '#9FA1D1' : undefined}
                                style={styles.checkbox}/>
                        <Text style={styles.forgotOrRemember}> Remember me? </Text>
                    </View>
                    <TouchableOpacity> 
                        <Text style={{...styles.forgotOrRemember, textDecorationLine: 'underline'}}> Forgot Password? </Text> 
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}> Sign in </Text>
                </TouchableOpacity>

                <TouchableOpacity>
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
        gap: 12
    },
    header: {
        color: 'black', 
        fontSize: 24, 
        fontFamily: 'Inter', 
        fontWeight: '600'
    },
    desc: {
        color: '#8692A6',
        fontSize: 16,
        fontFamily: 'Inter',
        fontWeight: '400',
        lineHeight: 28
    },
    // INPUT CONTAINER STYLING
    miniContainer: {
        flexDirection: 'column', 
        justifyContent: 'flex-start', 
        alignItems: 'flex-start',
        gap: 10, 
        display: 'inline-flex',
        marginBottom: '5%'
    },
    genericText: {
        color: 'black',
        fontSize: 16,
        fontFamily: 'Inter',
        fontWeight: '500'
    },
    input: {
        borderRadius: 16,
        borderWidth: 1,
        width: 329, 
        paddingHorizontal: '1%',
        paddingVertical: '3.5%',
        background: 'white', 
        border: '1px #939393 solid'
    },
    // SIGN IN BUTTON STYLING
    button: {
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 40,
        backgroundColor: '#4044AB',
        borderRadius: 31, 
        gap: 10,
        marginVertical: '5%'
    },
    buttonText: {
        color: 'white', 
        fontSize: 14, 
        fontFamily: 'Inter', 
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
        fontFamily: 'Inter',
        fontWeight: '400'
    },
    // SIGN UP TEXT
    signUpText: {
        color: '#8E99AB',
        fontSize: 14,
        fontFamily: 'Inter',
        fontWeight: '400',
        textDecorationLine: 'underline'
    }
    
})

export default LoginScreen;