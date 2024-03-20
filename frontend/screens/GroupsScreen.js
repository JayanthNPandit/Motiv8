import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import loadFonts from '../fonts/loadFonts';
import image from '../assets/working-out.png';

const GroupsScreen = () => {
    useEffect(() => {
        loadFonts();
    }, []);
    
    return (
        <View style={styles.container}>
        <Text style={styles.header}>Groups</Text>
        <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Text style={styles.buttonText}>Create a Group</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Text style={styles.buttonText}>Join a Group</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Text style={styles.buttonText}>My Groups</Text>
        </TouchableOpacity>
        </View>
    );
    };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 70,
        marginBottom: 30
    },
    button: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#a68d8d',
        padding: 10,
        marginHorizontal: 2,
        marginVertical: 5
    },
    header: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 24,
        marginBottom: 10
    },
    buttonText: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 16
    }
});

export default GroupsScreen;