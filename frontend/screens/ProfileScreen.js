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

  const { user, logout } = useAuth();

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
      allowsEditing: false,
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

  // logout function
  const handleLogout = async () => {
    setIsClickable(false);
    await logout();
    setIsClickable(true);
    navigation.navigate("Welcome");
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
    if (group == "") await leaveGroup(user, origGroup, groupData);
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
          {edit && <Image style={styles.image} source={{ url: imageUrl }} />}
        </TouchableOpacity>

        {groupData !== "" && group !== '' && (
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
          <View>
            <TouchableOpacity
              style={styles.editContainer}
              onPress={() => setEdit(true)}
            >
              <Text
                style={{
                  ...containerStyles.longWhiteButton,
                  borderRadius: 25,
                }}
              >
                Edit Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                ...containerStyles.longPurpleButton,
                paddingHorizontal: "25%",
                marginVertical: "2%",
              }}
            >
              <Text style={{ ...textStyles.textBodySmall, color: "white" }}>
                View all your photos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                ...containerStyles.longPurpleButton,
                paddingHorizontal: "25%",
                marginVertical: "2%",
              }}
              onPress={() => navigation.navigate("Goals")}
            >
              <Text style={{ ...textStyles.textBodySmall, color: "white" }}>
                See all your goals
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {edit && (
          <View style={containerStyles.buttonContainer}>
            <TouchableOpacity
              style={containerStyles.whiteButton}
              disabled={!isClickable}
              onPress={handleCancel}
            >
              <Text style={textStyles.textBodyHeader}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={containerStyles.purpleButton}
              disabled={!isClickable}
              onPress={handleChange}
            >
              <Text style={textStyles.textBodyHeaderWhite}>Save</Text>
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
    width: "58%",
    height: "30%",
    marginBottom: "5%",
  },
  groupTag: {
    width: "40%",
    height: "5.5%",
    backgroundColor: "#9FA1D1",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    display: "flex",
    flexDirection: "row",
    marginBottom: "5%",
  },
});

export default ProfileScreen;
