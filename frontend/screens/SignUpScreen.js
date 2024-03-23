import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { textStyles, containerStyles } from '../styles/styles';

const SignUpScreen = ({navigation}) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isClickable, setIsClickable] = useState(true);

    const { register, loginError } = useAuth();
    
    const handleRegister = async () => {
        if (email === '' || password === '') {
            Alert.alert('Email and/or password fields are empty. Try again');
            return;
        }

        setIsClickable(false);
        await register(email, password);
        if (loginError) {
            Alert.alert('Failed to create an account. Try again');
            setEmail('');
            setPassword('');
            setIsClickable(true);
        } else {
            setEmail('');
            setPassword('');
            setIsClickable(true);
            navigation.navigate("Onboarding");
        }
    }

    return (
        <View style={containerStyles.background}>
            <View style={containerStyles.container}>
                <View style={containerStyles.headerContainer}>
                    <Text style={textStyles.header}> Sign Up </Text>
                    <Text style={textStyles.textBodyGray}> Get Started with Motiv8 </Text>
                </View>

                <View style={containerStyles.inputContainer}>
                    <Text style={textStyles.textBodyHeaderBold}> Email: </Text>
                    <TextInput value={email} style={containerStyles.input} onChangeText={setEmail}/>
                </View>
                <View style={containerStyles.inputContainer}>
                    <Text style={textStyles.textBodyHeaderBold}> Password: </Text>
                    <TextInput value={password} secureTextEntry={true} style={containerStyles.input} onChangeText={setPassword}/>
                </View>

                <TouchableOpacity style={containerStyles.purpleButton} onPress={handleRegister} disabled={!isClickable}>
                    <Text style={textStyles.textBodyHeaderWhite}> Register </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text style={{...textStyles.textBodySmallUnderline, color: "#8E99AB"}}> Already have an account? Log in </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default SignUpScreen;