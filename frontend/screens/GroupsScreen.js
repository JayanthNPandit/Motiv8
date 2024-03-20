import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import loadFonts from '../fonts/loadFonts';
import image from '../assets/working-out.png';

const GroupsScreen = () => {

    const [goals, setGoals] = useState([]);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await fetch('fetchMembersEndpoint');
                const data = await response.json();
                setMembers(data.members);
            } catch (error) {
                console.error('Error fetching members:', error);
            }
        }

        loadFonts();
    }, []);

    // uhh how do i make this invite feature???
    const inviteMember = () => {
        // Invite a new member to the group
        const newMember = 'New member';
        setMembers([...members, newMember]);
    }

    // chat gpt said do this but idt it works so I will try to fix that later
    const generateCode = async () => {
        try {
          const response = await fetch('https://your-api.com/groups/generate-code', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // Add any required authentication headers
            },
            body: JSON.stringify({ groupId: groupId }),
          });
          const data = await response.json();
          return data.code; // Return the generated code
        } catch (error) {
          console.error('Error generating code:', error);
          // Handle error
        }
      };
      
      // Join Group Screen
      const joinGroup = async (code) => {
        try {
          const response = await fetch('https://your-api.com/groups/join', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // Add any required authentication headers
            },
            body: JSON.stringify({ code: code }),
          });
          const data = await response.json();
          // Handle success
        } catch (error) {
          console.error('Error joining group:', error);
          // Handle error
        }
      }

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