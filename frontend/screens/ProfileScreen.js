import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  fetchGroupData,
  leaveGroup,
  changeUserData,
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
} from "react-native";
import image from "../assets/default-pfp.png";
import settings from "../assets/settings.png";
import back from "../assets/back_arrow.png";
import remove from "../assets/Add.png";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { manipulateAsync } from "expo-image-manipulator";

const ProfileScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [origName, setOrigName] = useState("");
  const [username, setUsername] = useState("");
  const [origUsername, setOrigUsername] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [origImageUrl, setOrigImageUrl] = useState("");
  const [group, setGroup] = useState("");
  const [origGroup, setOrigGroup] = useState("");
  const [groupData, setGroupData] = useState("");
  const [edit, setEdit] = useState(false);
  const [isClickable, setIsClickable] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    fetchUserData(user.uid).then((data) => {
      setName(data.name);
      setOrigName(data.name);
      setUsername(data.username);
      setOrigUsername(data.username);
      setImageUrl(data.profilePicture);
      setOrigImageUrl(data.profilePicture);
      setGroup(data.groupID);
      setOrigGroup(data.groupID);
      setEdit(false);

      if (data.groupID !== "") {
        fetchGroupData(data.groupID).then((groupData) => {
          setGroupData(groupData);
        });
      }
    });
  }, []);

  useEffect(() => {
    if (edit) {
      setIsClickable(true);
    }
  }, [edit]);

  useEffect(() => {}, [imageUrl]);

  const pickImage = async () => {
    // selected image
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.cancelled && result.assets) {
      const url = result.assets[0].uri;
      const fileInfo = await FileSystem.getInfoAsync(url);
      const originalFileSize = fileInfo.size;
      // compress if greater than 1.5 MB (prevents crashing)
      if (originalFileSize > 1024 * 1024 * 1.5) {
        const compressedImage = await manipulateAsync(url, [], {
          compress: 0.3,
        });
        setImageUrl(compressedImage.uri);
      } else {
        setImageUrl(url);
      }
    }
  };

  const handleCancel = () => {
    setEdit(false);
    setIsClickable(false);
    setName(origName);
    setUsername(origUsername);
    setImageUrl(origImageUrl);
    setGroup(origGroup);
  };

  // change data
  const handleChange = async () => {
    if (name === "" || username === "") {
      Alert.alert("Please fill out all the fields");
      return;
    }
    setIsClickable(false);
    if (group === "" && origGroup !== "")
      await leaveGroup(user, origGroup, groupData);
    await changeUserData(user, name, username, imageUrl);
    setOrigName(name);
    setOrigUsername(username);
    setOrigImageUrl(imageUrl);
    setIsClickable(true);
    setEdit(false);
  };

  return (
    <View style={containerStyles.background}>
      <View style={containerStyles.container}>
        <View style={containerStyles.headerContainer}>
          <Text style={textStyles.header}> Hi, {origName}! </Text>
          <Text style={textStyles.textBodyGray}>
            {!edit ? "Let's view your profile" : "Let's edit your profile"}
          </Text>
        </View>

        {!edit && (
          <TouchableOpacity
            style={containerStyles.forward}
            onPress={() => navigation.navigate("Settings")}
          >
            <Image source={settings} />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.imageContainer}
          disabled={!isClickable}
          onPress={pickImage}
        >
          {!edit && (
            <Image
              style={styles.image}
              source={imageUrl === "" ? image : { url: origImageUrl }}
            />
          )}
          {edit && <Image style={styles.image} source={imageUrl === "" ? image : { url: imageUrl }} />}
        </TouchableOpacity>

        {groupData !== "" && group !== "" && (
          <View style={styles.groupTag}>
            <Text style={textStyles.textBodySmallWhite}>{groupData.name}</Text>
            {edit && (
              <TouchableOpacity onPress={() => setGroup("")}>
                <Image source={remove} />
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={containerStyles.inputContainer}>
          <Text style={textStyles.textBodyHeader}> Username: </Text>
          <TextInput
            style={containerStyles.input}
            value={!edit ? origUsername : username}
            editable={isClickable}
            onChangeText={setUsername}
          />
        </View>
        <View style={containerStyles.inputContainer}>
          <Text style={textStyles.textBodyHeader}> Name: </Text>
          <TextInput
            style={containerStyles.input}
            value={!edit ? origName : name}
            editable={isClickable}
            onChangeText={setName}
          />
        </View>
        {!edit && (
          <View style={styles.editContainer}>
            <TouchableOpacity
              style={{
                ...containerStyles.purpleButton,
                marginBottom: "0%",
              }}
              onPress={() =>
                navigation.navigate("Gallery")
              }
            >
              <Text style={textStyles.textBodyHeaderWhite}>
                View all your photos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                ...containerStyles.whiteButton,
                paddingHorizontal: "25%",
              }}
              onPress={() => setEdit(true)}
            >
              <Text style={textStyles.textBodyHeaderPurple}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        )}
        {edit && (
          <View style={styles.editContainer}>
            <TouchableOpacity
              style={{
                ...containerStyles.purpleButton,
                marginBottom: "0%",
              }}
              disabled={!isClickable}
              onPress={handleChange}
            >
              <Text style={textStyles.textBodyHeaderWhite}>Save Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                ...containerStyles.whiteButton,
                paddingHorizontal: "20%",
              }}
              onPress={handleCancel}
            >
              <Text style={textStyles.textBodyHeaderPurple}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  editContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: "2%",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 1000,
    marginVertical: "3%",
  },
  imageContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "48%",
    height: "27%",
    marginVertical: "5%",
  },
  groupTag: {
    width: "60%",
    height: "6.5%",
    backgroundColor: "#9FA1D1",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    display: "flex",
    flexDirection: "row",
    marginTop: "5%",
    marginBottom: "7%",
  },
});

export default ProfileScreen;
