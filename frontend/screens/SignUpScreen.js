import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { createUser } from "../backendFunctions";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { textStyles, containerStyles } from "../styles/styles";

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [isClickable, setIsClickable] = useState(true);

  const { user, register } = useAuth();

  useEffect(() => {
    console.log(user);
  }, [user]);

  const handleRegister = async () => {
    if (email === "" || password === "") {
      Alert.alert("Email and/or password fields are empty. Try again");
      return;
    }
    if (password !== password2) {
      Alert.alert("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Password needs to be longer than 6 characters");
      return;
    }
    setIsClickable(false);
    console.log("Email: " + email + ", Password:" + password);

    const result = await register(email, password);

    if (!result.success) {
      Alert.alert("Failed to create an account", result.message); // Use the error message
      setEmail("");
      setPassword("");
      setIsClickable(true);
    } else {
      setEmail("");
      setPassword("");
      setIsClickable(true);
      navigation.navigate("Onboarding");
    }
  };

  return (
    <View style={containerStyles.background}>
      <View style={containerStyles.container}>
        <View style={containerStyles.headerContainer}>
          <Text style={textStyles.header}> Sign Up </Text>
          <Text style={textStyles.textBodyGray}> Get Started with Motiv8 </Text>
        </View>

        <View style={containerStyles.inputContainer}>
          <Text style={textStyles.textBodyHeader}> Email: </Text>
          <TextInput
            value={email}
            style={containerStyles.input}
            onChangeText={setEmail}
          />
        </View>
        <View style={containerStyles.inputContainer}>
          <Text style={textStyles.textBodyHeader}> Password: </Text>
          <TextInput
            value={password}
            secureTextEntry={true}
            style={containerStyles.input}
            onChangeText={setPassword}
          />
        </View>
        <View style={containerStyles.inputContainer}>
          <Text style={textStyles.textBodyHeader}> Confirm Password: </Text>
          <TextInput
            value={password2}
            secureTextEntry={true}
            style={containerStyles.input}
            onChangeText={setPassword2}
          />
        </View>

        <TouchableOpacity
          style={containerStyles.purpleButton}
          onPress={handleRegister}
          disabled={!isClickable}
        >
          <Text style={textStyles.textBodyHeaderWhite}> Register </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text
            style={{ ...textStyles.textBodySmallUnderline, color: "#8E99AB" }}
          >
            {" "}
            Already have an account? Log in{" "}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignUpScreen;
