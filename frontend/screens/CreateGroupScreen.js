import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { createGroup } from  "../backendFunctions";
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { textStyles, containerStyles } from '../styles/styles';
import image from '../assets/working-out-4.png';

const CreateGroupScreen = ({navigation}) => {

    const [groupName, setGroupName] = useState('');
    const [isClickable, setIsClickable] = useState(true);
    const { user } = useAuth();

    const handleGroupCreation = async () => {
        setIsClickable(false);
        const id = await createGroup(user, groupName);
        if (!id) {
            setIsClickable(true);
            Alert.alert("Error generating group. Try again");
        } else {
            setGroupName('');
            setIsClickable(true);
            navigation.navigate("GroupCode", {groupID: id}); 
        }
    }

    return (
        <View style={containerStyles.background}>
            <View style={containerStyles.container}>
                <View style={containerStyles.headerContainer}>
                    <Text style={textStyles.header}>Create a group</Text>
                    <Text style={textStyles.textBodyGray}>Create a Motiv8 Group!</Text>
                </View>
                <Image style={styles.image} source={image}/>
                <View style={{...containerStyles.inputContainer, width:'87%'}}>
                    <Text style={textStyles.textBodyHeaderBold}> Enter Group Name: </Text>
                    <TextInput value={groupName} style={containerStyles.input} onChangeText={setGroupName}/>
                </View>
                <View style={containerStyles.buttonContainer}>
                    <TouchableOpacity style={containerStyles.whiteButton} onPress={() => navigation.navigate("Groups")} disabled={!isClickable}>
                        <Text style={textStyles.textBodyHeader}> Back </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={containerStyles.purpleButton} onPress={handleGroupCreation} disabled={!isClickable}>
                        <Text style={textStyles.textBodyHeaderWhite}> Submit </Text>
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
        height: '20%',
        margin: '15%'
    }
})

export default CreateGroupScreen;