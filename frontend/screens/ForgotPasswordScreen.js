import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { textStyles, containerStyles } from '../styles/styles';

const ForgotPasswordScreen = ({navigation}) => {

    const [email, setEmail] = useState("");
    const [isClickable, setIsClickable] = useState(true);

    const { resetPassword, resetError } = useAuth();
    
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
        <View style={containerStyles.background}>
            <View style={containerStyles.container}>
                <View style={containerStyles.headerContainer}>
                    <Text style={textStyles.header}> Forgot Password </Text>
                    <Text style={textStyles.textBodyGray}> Follow the steps below. </Text>
                </View>

                <View style={containerStyles.inputContainer}>
                    <Text style={textStyles.textBodyHeaderBold}> Enter Email: </Text>
                    <TextInput style={containerStyles.input} onChangeText={setEmail}/>
                </View>

                <View style={containerStyles.buttonContainer}>
                    <TouchableOpacity style={containerStyles.whiteButton} onPress={() => navigation.navigate("Login")} disabled={!isClickable}>
                        <Text style={textStyles.textBodyHeader}> Back </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={containerStyles.purpleButton} onPress={handleReset} disabled={!isClickable}>
                        <Text style={textStyles.textBodyHeaderWhite}> Submit </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

export default ForgotPasswordScreen;