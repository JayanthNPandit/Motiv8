import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { fetchGroupData, fetchUserData, joinGroup } from "../backendFunctions";
import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { textStyles, containerStyles } from "../styles/styles";
import image from "../assets/default-pfp.png";

const ConfirmGroupScreen = ({ navigation }) => {
  const [isClickable, setIsClickable] = useState(true);
  const [names, setNames] = useState(null);
  const [groupData, setGroupData] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadInformation = async () => {
      const names = [];
      const data = await fetchUserData(user.uid);
      const groupData = await fetchGroupData(data.groupID);
      const users = groupData.users;
      await Promise.all(
        users.map(async (user) => {
          const data = await fetchUserData(user);
          names.push({ name: data.name, pfp: data.profilePicture });
        })
      );
      setNames(names);
      return groupData;
    };

    setIsClickable(false);
    loadInformation().then((group) => {setGroupData(group)});
    setIsClickable(true);
  }, []);

  return (
    <View style={containerStyles.background}>
      <View style={containerStyles.container}>
        <View style={containerStyles.headerContainer}>
          <Text style={textStyles.header}>{groupData.name}</Text>
          <Text style={textStyles.textBodyGray}>Your friends in this group!</Text>
        </View>
        <FlatList
          data={names}
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
    paddingRight: "30%",
    gap: 10,
  },
  image: {
    width: "20%",
    height: "40%",
    padding: "15%",
    borderRadius: 1000,
  },
});

export default ConfirmGroupScreen;
