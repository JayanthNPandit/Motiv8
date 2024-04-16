import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  fetchGroupData,
  leaveGroup,
  delUser,
  fetchUserData,
} from "../backendFunctions";
import { textStyles, containerStyles } from "../styles/styles";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
} from "react-native";
import { CommonActions } from "@react-navigation/native";
import back from "../assets/back_arrow.png";
import bell from "../assets/bell.png";
import signout from "../assets/logout.png";
import delIcon from "../assets/del.png";

const SettingsScreen = ({ navigation }) => {
  const { user, logout, del } = useAuth();
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  // logout function
  const handleLogout = async () => {
    await logout();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Welcome" }],
      })
    );
  };

  // delete function
  const handleDelete = async () => {
    const data = await fetchUserData(user.uid);
    if (data.groupID !== "") {
      const groupData = await fetchGroupData(data.groupID);
      await leaveGroup(user, data.groupID, groupData);
    }
    delUser(user);
    await del();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Welcome" }],
      })
    );
  };

  const confirmLogout = () =>
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "No",
        style: "cancel",
      },
      { text: "Yes", onPress: handleLogout },
    ]);

  const confirmDelete = () =>
    Alert.alert(
      "Permanent Action",
      "Are you sure you want to delete your account?",
      [
        {
          text: "No",
          style: "cancel",
        },
        { text: "Yes", onPress: handleDelete },
      ]
    );

  return (
    <View style={containerStyles.background}>
      <View style={containerStyles.container}>
        <View
          style={{ ...containerStyles.headerContainer, marginBottom: "15%" }}
        >
          <Text style={textStyles.header}> Settings </Text>
        </View>

        <TouchableOpacity
          style={containerStyles.back}
          onPress={() => navigation.navigate("Profile")}
        >
          <Image source={back} />
        </TouchableOpacity>

        <View style={styles.setting}>
          <View style={styles.line} />
          <View style={styles.notificationContainer}>
            <View style={styles.option}>
              <Image source={bell} />
              <Text style={textStyles.textBody}> Notifications </Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#8098D5" }}
              thumbColor={isEnabled ? "#ffffff" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
        </View>

        <View style={styles.setting}>
          <View style={styles.line} />
          <TouchableOpacity style={styles.option} onPress={confirmLogout}>
            <Image source={signout} />
            <Text style={textStyles.textBody}> Logout </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.setting}>
          <View style={styles.line} />
          <TouchableOpacity style={styles.option} onPress={confirmDelete}>
            <Image source={delIcon} />
            <Text style={textStyles.textBody}> Delete Account </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  line: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#8692A6",
  },
  setting: {
    width: "100%",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: "10%",
    margin: "2%",
  },
  option: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: "5%",
    gap: "15%",
    width: "80%",
  },
  notificationContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default SettingsScreen;
