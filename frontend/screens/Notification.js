import React from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';

const Notification = ({ visible, message }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.notification}>
          <Text>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notification: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
});

export default Notification;

// this is the code to make it appear
/*
const handleAction = () => {
    // Perform your action here
    // Show notification
    setNotificationMessage('Action completed successfully');
    setShowNotification(true);

    // Hide notification after a few seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 2000);
  };
*/
