import React, { useEffect, useState } from "react";
import {
  Image,
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { textStyles, containerStyles } from "../styles/styles";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "../contexts/AuthContext";
import { addGoal } from "../backendFunctions";
import recurringImage from "../assets/amico.png";
import back from "../assets/back_arrow.png";
import longTermImage from "../assets/rafiki.png";

const AddGoalScreen = ({ route, navigation }) => {
  const { disableNav } = route.params;
  const [goalName, setGoalName] = useState("");
  const [goalType, setGoalType] = useState("");
  const [frequency, setFrequency] = useState("");
  const [description, setDescription] = useState("");
  const [isClickable, setIsClickable] = useState(true);

  const { user } = useAuth();

  const check = user.email;

  return (
    <ScrollView style={containerStyles.background}>
      <View style={containerStyles.container}>
        <View style={containerStyles.headerContainer}>
          <Text style={textStyles.header}> Add a Goal </Text>
          <Text style={textStyles.textBodyGray}> Choose your Goal Type: </Text>
        </View>
        {!disableNav && (
          <TouchableOpacity
            style={{ ...containerStyles.back, top: "1%" }}
            onPress={() => navigation.navigate("Onboarding")}
          >
            <Image source={back} />
          </TouchableOpacity>
        )}

        {!disableNav && (
          <TouchableOpacity
            style={{ ...containerStyles.skipForward, top: "1%" }}
            onPress={() => navigation.navigate("Groups")}
          >
            <Text
              style={{ ...textStyles.textBodySmallUnderline, color: "#8E99AB" }}
            >
              Skip
            </Text>
          </TouchableOpacity>
        )}

        <View style={containerStyles.listContainer}>
          <Image source={recurringImage} style={styles.image} />
          <Text style={textStyles.textBodyGray}>
            {" "}
            For goals that you want to {"\n"} complete at a specific frequency{" "}
          </Text>
          <TouchableOpacity
            style={containerStyles.blueButton}
            onPress={() => navigation.navigate("AddRecurringGoal")}
          >
            <Text style={textStyles.textBodyHeaderWhite}> Recurring Goal </Text>
          </TouchableOpacity>
        </View>

        <View style={containerStyles.divider}></View>

        <View style={containerStyles.listContainer}>
          <Text style={textStyles.textBodyGray}>
            {" "}
            For goals where you want to {"\n"} achieve a certain milestone{" "}
          </Text>
          <Image source={longTermImage} style={styles.image} />
          <TouchableOpacity
            style={containerStyles.blueButton}
            onPress={() => navigation.navigate("AddLongTermGoal")}
          >
            <Text style={textStyles.textBodyHeaderWhite}> Long-Term Goal </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  picker: {
    width: "100%",
  },
});

export default AddGoalScreen;
