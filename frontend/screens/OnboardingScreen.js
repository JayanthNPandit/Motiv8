import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { createUser, delUser } from "../backendFunctions";
import { deleteUser } from "firebase/auth";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { textStyles, containerStyles } from "../styles/styles";
import image from "../assets/default-pfp.png";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { manipulateAsync } from "expo-image-manipulator";

const Onboarding = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [isClickable, setIsClickable] = useState(true);
  const [imageUrl, setImageUrl] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    const creation = async () => {
      await createUser(user, "", "", "");
    };
    creation();
  }, []);

  // choosing the image
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

  const deleteUserAndTryAgain = async () => {
    try {
      await deleteUser(user);
      await delUser(user);
    } catch (error) {
      console.log(error);
    }
    navigation.navigate("SignUp");
  };

  const addUserInfo = async () => {
    setIsClickable(false);
    // test inputs
    if (username === "" || name === "") {
      Alert.alert("Please fill out all the fields");
      setIsClickable(true);
      return;
    }

    try {
      await createUser(user, username, name, imageUrl);
    } catch (error) {
      console.log(error);
    }
    setIsClickable(true);
    navigation.navigate("Groups");
  };

  return (
    <View style={containerStyles.background}>
      <View style={containerStyles.container}>
        <View style={containerStyles.headerContainer}>
          <Text style={textStyles.header}> Hey there! </Text>
          <Text style={textStyles.textBodyGray}> Let's get you set up </Text>
        </View>
        <Image
          style={styles.image}
          source={imageUrl == null ? image : { url: imageUrl }}
        />
        <TouchableOpacity
          style={containerStyles.purpleButton}
          onPress={pickImage}
        >
          <Text style={textStyles.textBodyHeaderWhite}>
            {" "}
            Add a profile photo{" "}
          </Text>
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <TextInput
            style={containerStyles.input}
            placeholder="Enter a username"
            onChangeText={setUsername}
          />
          <TextInput
            style={containerStyles.input}
            placeholder="Enter your name"
            onChangeText={setName}
          />
        </View>
        <View style={containerStyles.buttonContainer}>
          <TouchableOpacity
            style={containerStyles.whiteButton}
            onPress={deleteUserAndTryAgain}
            disabled={!isClickable}
          >
            <Text style={textStyles.textBodyHeader}> Back </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={containerStyles.purpleButton}
            onPress={addUserInfo}
            disabled={!isClickable}
          >
            <Text style={textStyles.textBodyHeaderWhite}> Next </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // INPUT CONTAINER STYLING
  inputContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 25,
    display: "flex",
    marginVertical: "5%",
    width: "92%",
  },
  // IMAGE
  image: {
    width: "60%",
    height: "30%",
    borderRadius: 1000,
    marginVertical: "5%",
  },
});

export default Onboarding;
