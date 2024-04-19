import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { fetchGroupData, fetchUserData, leaveGroup } from "../backendFunctions";
import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  RefreshControl,
} from "react-native";
import { textStyles, containerStyles } from "../styles/styles";
import * as Clipboard from "expo-clipboard";
import image from "../assets/default-pfp.png";
import leave from "../assets/leave_group.png";
import copy from "../assets/copy.png";

const MyGroupScreen = ({ navigation }) => {
  const [names, setNames] = useState(null);
  const [groupData, setGroupData] = useState(null);
  const [groupID, setGroupID] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const loadInformation = async () => {
    const names = [];
    const data = await fetchUserData(user.uid);
    const id = data.groupID;
    const groupData = await fetchGroupData(id);
    const users = groupData.users;
    await Promise.all(
      users.map(async (user) => {
        const data = await fetchUserData(user);
        names.push({ name: data.name, pfp: data.profilePicture });
      })
    );
    setNames(names);
    setGroupData(groupData);
    setGroupID(id);
    setRefreshing(false);
  };

  useEffect(() => {
    loadInformation();
  }, []);

  useEffect(() => {
    console.log(groupID);
  }, [groupData, groupID]);

  const handleLeaveGroup = async () => {
    console.log(groupData);
    await leaveGroup(user, groupID, groupData);
    setGroupID("");
    setGroupData({});
    navigation.navigate("Groups");
  };

  const copyCode = async () => {
    await Clipboard.setStringAsync(groupID);
    Alert.alert("Success!", "Copied group code");
  };

  const confirmLeaveGroup = () =>
    Alert.alert("Leave Group", "Are you sure you want to leave the group?", [
      {
        text: "No",
        style: "cancel",
      },
      { text: "Yes", onPress: handleLeaveGroup },
    ]);

  return (
    <View style={containerStyles.background}>
      <View style={{ ...containerStyles.container, marginHorizontal: 22 }}>
        <View style={containerStyles.headerContainer}>
          <Text style={textStyles.header}>Your Group</Text>
          <Text style={textStyles.textBodyGray}>
            Your friends in this group!
          </Text>
        </View>

        <TouchableOpacity
          style={containerStyles.forward}
          onPress={confirmLeaveGroup}
        >
          <Image source={leave} style={{width: 32, height: 32}} />
        </TouchableOpacity>

        <View style={containerStyles.inputContainer}>
          <Text style={textStyles.textBodyHeader}> Code: </Text>
          <View style={styles.copyContainer}>
            <Text> {groupID} </Text>
            <TouchableOpacity onPress={copyCode}>
              <Image style={styles.copyImage} source={copy} />
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={names}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={loadInformation}
            />
          }
          renderItem={({ item }) => (
            <View style={styles.users}>
              <Image
                style={styles.image}
                source={item.pfp == null ? image : { url: item.pfp }}
              />
              <Text style={textStyles.textBody}> {item.name} </Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  users: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginVertical: "3%",
    paddingRight: "45%",
    gap: 10,
  },
  image: {
    width: "20%",
    height: "40%",
    padding: "15%",
    borderRadius: 1000,
  },
  copyImage: {
    width: 30,
    height: 30,
  },
  copyContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#939393",
    borderRadius: 16,
    width: "100%",
    paddingHorizontal: "2%",
    paddingVertical: "4.5%",
  },
});

export default MyGroupScreen;
