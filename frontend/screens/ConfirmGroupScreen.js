import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { fetchUserData, joinGroup } from "../backendFunctions";
import { View, Text, TextInput, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { textStyles, containerStyles } from '../styles/styles';
import image from '../assets/default-pfp.png';

const ConfirmGroupScreen = ({route, navigation}) => {

    const [isClickable, setIsClickable] = useState(true);
    const [names, setNames] = useState(null);
    const {groupData, groupID} = route.params;
    const {user} = useAuth();

    useEffect(() => {
        const loadInformation = async () => {
            const names = [];
            const users = groupData.users;
            await Promise.all(users.map(async (user) => {
                const data = await fetchUserData(user);
                names.push({ name: data.name, pfp: data.profilePicture });
            }));
            setNames(names);
        }

        setIsClickable(false);
        loadInformation();
        setIsClickable(true);
    }, []);

    const joinGroup = async () => {
        setIsClickable(false);
        await joinGroup(user, groupData, groupID);
        setIsClickable(true);
        navigation.navigate("Profile");
    };

    return (
        <View style={containerStyles.background}>
            <View style={containerStyles.container}>
                <View style={containerStyles.headerContainer}>
                    <Text style={textStyles.header}>{groupData.name}</Text>
                    <Text style={textStyles.textBodyGray}>Confirm your group</Text>
                </View>
                <FlatList
                    data={names}
                    renderItem={({item}) => 
                    (<View style={styles.users}>
                        <Image style={styles.image} source={item.pfp==null ? image : {url: item.pfp}}/>
                        <Text style={textStyles.textBody}> {item.name} </Text>
                    </View>)}
                    keyExtractor={(item, index) => index.toString()}
                />
                <View style={containerStyles.buttonContainer}>
                    <TouchableOpacity style={containerStyles.whiteButton} onPress={() => navigation.navigate("JoinGroup")} disabled={!isClickable}>
                        <Text style={textStyles.textBodyHeader}> Back </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={containerStyles.purpleButton} onPress={joinGroup} disabled={!isClickable}>
                        <Text style={textStyles.textBodyHeaderWhite}> Join </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    users: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginVertical: '3%',
        paddingRight: '30%',
        gap: 10,
    },
    image: {
        width: '15%',
        height: '30%',
        padding: '10%',
    }
})

export default ConfirmGroupScreen;