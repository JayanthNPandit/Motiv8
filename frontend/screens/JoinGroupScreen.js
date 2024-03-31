import React, { useState, useEffect } from 'react';
import { fetchGroupData } from "../backendFunctions";
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { textStyles, containerStyles } from '../styles/styles';
import image from '../assets/working-out-3.png';

const JoinGroupScreen = ({navigation}) => {

    const [groupCode, setGroupCode] = useState('');
    const [isClickable, setIsClickable] = useState(true);

    const checkGroup = async () => {
        setIsClickable(false);
        const data = await fetchGroupData(groupCode);
        if (!data) {
            setIsClickable(true);
            Alert.alert("Incorrect code. Try again");
        } else {
            setGroupCode('');
            setIsClickable(true);
            navigation.navigate("ConfirmGroup", {groupData: data, groupID: groupCode}); 
        }
    }

    return (
        <View style={containerStyles.background}>
            <View style={containerStyles.container}>
                <View style={containerStyles.headerContainer}>
                    <Text style={textStyles.header}>Join a group</Text>
                    <Text style={textStyles.textBodyGray}>See what your friends are up to!</Text>
                </View>
                <Image style={styles.image} source={image}/>
                <View style={{...containerStyles.inputContainer, width:'87%'}}>
                    <Text style={textStyles.textBodyHeader}> Enter group code: </Text>
                    <TextInput value={groupCode} style={containerStyles.input} onChangeText={setGroupCode}/>
                </View>
                <View style={containerStyles.buttonContainer}>
                    <TouchableOpacity style={containerStyles.whiteButton} onPress={() => navigation.navigate("Groups")} disabled={!isClickable}>
                        <Text style={textStyles.textBodyHeader}> Back </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={containerStyles.purpleButton} onPress={checkGroup} disabled={!isClickable}>
                        <Text style={textStyles.textBodyHeaderWhite}> Next </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    // IMAGE STYLING
    image: {
        width: '70%',
        height: '25%',
        margin: '10%'
    }
})

export default JoinGroupScreen;