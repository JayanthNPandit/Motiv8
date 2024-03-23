import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { textStyles, containerStyles } from '../styles/styles';
import image from '../assets/working-out-3.png';

const JoinGroupScreen = ({navigation}) => {

    const [groupCode, setGroupCode] = useState('');
    const [isClickable, setIsClickable] = useState(true);

    return (
        <View style={containerStyles.background}>
            <View style={styles.container}>
                <View style={containerStyles.headerContainer}>
                    <Text style={textStyles.header}>Join a group</Text>
                    <Text style={textStyles.textBodyGray}>See what your friends are up to!</Text>
                </View>
                <Image style={styles.image} source={image}/>
                <View style={{...containerStyles.inputContainer, width:'87%'}}>
                    <Text style={textStyles.textBodyHeaderBold}> Enter group code: </Text>
                    <TextInput value={groupCode} style={containerStyles.input} onChangeText={setGroupCode}/>
                </View>
                <View style={containerStyles.buttonContainer}>
                    <TouchableOpacity style={containerStyles.whiteButton} onPress={() => navigation.navigate("Groups")} disabled={!isClickable}>
                        <Text style={textStyles.textBodyHeader}> Back </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={containerStyles.purpleButton} disabled={!isClickable}>
                        <Text style={textStyles.textBodyHeaderWhite}> Next </Text>
                    </TouchableOpacity>
                </View>
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
    // IMAGE STYLING
    image: {
        width: '70%',
        height: '25%',
        margin: '10%'
    }
})

export default JoinGroupScreen;