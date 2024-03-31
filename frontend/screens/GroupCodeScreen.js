import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { deleteGroup } from  "../backendFunctions";
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { textStyles, containerStyles } from '../styles/styles';
import image from '../assets/working-out-4.png';
import copy from '../assets/copy.png';

const GroupCodeScreen = ({route, navigation}) => {

    const [groupName, setGroupName] = useState('');
    const [isClickable, setIsClickable] = useState(true);
    const {user} = useAuth();
    const {groupID} = route.params;

    const handleGroupDelete = () => {
        setIsClickable(false);
        deleteGroup(user, groupID);
        setIsClickable(true);
        navigation.navigate("CreateGroup");
    }

    const copyCode = async () => {
        await Clipboard.setStringAsync(groupID);
    }

    return (
        <View style={containerStyles.background}>
            <View style={containerStyles.container}>
                <View style={containerStyles.headerContainer}>
                    <Text style={textStyles.header}>Group Code</Text>
                </View>
                <Image style={styles.image} source={image}/>
                <View style={containerStyles.inputContainer}>
                    <Text style={textStyles.textBodyHeaderBold}> Code: </Text>
                    <View style={styles.copyContainer}>
                        <Text> {groupID} </Text>
                        <TouchableOpacity onPress={copyCode}>
                            <Image style={styles.copyImage} source={copy}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={containerStyles.buttonContainer}>
                    <TouchableOpacity style={containerStyles.whiteButton} onPress={handleGroupDelete} disabled={!isClickable}>
                        <Text style={textStyles.textBodyHeader}> Back </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={containerStyles.purpleButton} onPress={() => navigation.navigate("Profile")} disabled={!isClickable}>
                        <Text style={textStyles.textBodyHeaderWhite}> Next </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    // COPY STYLING
    copyContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#939393',
        borderRadius: 16,
        width: '100%', 
        paddingHorizontal: '2%',
        paddingVertical: '4.5%',

    },
    copyImage: {
        width: 20,
        height: 20,
    },
    // IMAGE STYLING
    image: {
        width: '70%',
        height: '20%',
        margin: '15%'
    }
})

export default GroupCodeScreen;