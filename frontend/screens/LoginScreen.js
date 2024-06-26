import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import Checkbox from "expo-checkbox";
import { textStyles, containerStyles } from "../styles/styles";
import { CommonActions } from '@react-navigation/native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSelected, setSelection] = useState(false);
  const [isClickable, setIsClickable] = useState(true);

  const { login, remember } = useAuth();

  const handleLogin = async () => {
    setIsClickable(false);
    try {
      if (isSelected) await remember();
      const result = await login(email, password);
      if (!result.success) {
        Alert.alert("Login failed", result.message); // Use the error message
      } else {
        setEmail("");
        setPassword("");
        setSelection(false);
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Tab' }],
          })
        );
      }
    } catch (error) {
      console.error("Error occurred during login:", error);
      Alert.alert("Login failed", "An error occurred during login. Please try again later.");
    } finally {
      setIsClickable(true);
    }
  };

  return (
    <View style={containerStyles.background}>
      <View style={containerStyles.container}>
        <View style={containerStyles.headerContainer}>
          <Text style={textStyles.header}> Login </Text>
          <Text style={textStyles.textBodyGray}> Continue Your Journey </Text>
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

        <View style={styles.forgotOrRememberContainer}>
          <View style={styles.checkboxContainer}>
            <Checkbox
              value={isSelected}
              onValueChange={setSelection}
              color={isSelected ? "#9FA1D1" : undefined}
              style={styles.checkbox}
            />
            <Text style={{ ...textStyles.textBodySmall, color: "#545454" }}>
              Remember me?
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
            disabled={!isClickable}
          >
            <Text
              style={{
                ...textStyles.textBodySmall,
                color: "#545454",
                textDecorationLine: "underline",
              }}
            >
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={containerStyles.purpleButton}
          onPress={handleLogin}
          disabled={!isClickable}
        >
          <Text style={textStyles.textBodyHeaderWhite}> Sign in </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text
            style={{ ...textStyles.textBodySmallUnderline, color: "#8E99AB" }}
          >
            Don't have an account? Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // REMEMBER ME / FORGOT PW CONTAINER STYLING
  forgotOrRememberContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "92%",
  },
  checkboxContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: '3%'
  },
  checkbox: {
    borderColor: "black",
    borderWidth: 1,
  },
});

export default LoginScreen;
