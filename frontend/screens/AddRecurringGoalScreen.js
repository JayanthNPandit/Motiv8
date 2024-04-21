import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  Alert,
} from "react-native";
import { textStyles, containerStyles } from "../styles/styles";
import { useAuth } from "../contexts/AuthContext";
import { addGoal } from "../backendFunctions";

const AddRecurringGoalScreen = ({ route, navigation }) => {
  const {disableNav} = route.params;
  const [goalName, setGoalName] = useState("");
  const [type, setType] = useState("Recurring");
  const [frequency, setFrequency] = useState("Day");
  const [counter, setCounter] = useState("");
  const [description, setDescription] = useState("");
  const [isClickable, setIsClickable] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const { user } = useAuth();

  const frequencyOptions = ["Day", "Week", "Month", "Year"];

  // Function to handle adding a new goal
  const handleNewGoal = async () => {
    if (!goalName || !frequency || !counter) {
      Alert.alert("Name, frequency, and counter are required fields.");
      setIsClickable(true);
      return;
    }

    setIsClickable(false);
    const id = await addGoal(
      user,
      goalName,
      type,
      frequency,
      counter,
      "",
      description
    );

    if (!id) {
      setIsClickable(true);
      console.log("Error adding goal. Try again");
    } else {
      setGoalName("");
      setCounter("");
      setDescription("");
      setIsClickable(true);
    }

    if (disableNav) navigation.navigate("Goals");
    else navigation.navigate("Groups")
  };

  const handleOptionSelect = (option) => {
    setFrequency(option);
    setDropdownVisible(false);
    console.log("Frequency: " + frequency);
    console.log("dropdown: " + dropdownVisible);
  };

  return (
    <ScrollView style={containerStyles.background}>
      <View style={containerStyles.container}>
        <View style={containerStyles.headerContainer}>
          <Text style={textStyles.header}>Add a Recurring Goal</Text>
          <Text style={textStyles.textBodyGray}>
            You can always change this later!
          </Text>
        </View>

        <View style={containerStyles.purpleInputContainer}>
          <Text style={textStyles.textBodyHeader}>Choose a goal type:</Text>
          <TextInput
            style={{ ...containerStyles.input, backgroundColor: "#E8EFFF" }}
            value={type}
            onChangeText={setType}
            editable={false}
          />

          <Text style={textStyles.textBodyHeader}>
            Enter a name for your goal:
          </Text>
          <TextInput
            style={containerStyles.input}
            value={goalName}
            onChangeText={setGoalName}
          />

          <Text style={textStyles.textBodyHeader}>Choose a frequency:</Text>
          <View style={containerStyles.buttonContainer}>
            <TextInput
              style={containerStyles.counterInput}
              value={counter}
              onChangeText={setCounter}
              keyboardType="numeric"
            />
            <Text style={textStyles.bottomText}>times per</Text>
            {dropdownVisible ? (
              <View>
                <FlatList
                  data={frequencyOptions}
                  nestedScrollEnabled={true}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleOptionSelect(item)}
                      style={styles.option}
                    >
                      <Text>{item}</Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  style={styles.dropdownContainer}
                />
              </View>
            ) : (
              <TouchableOpacity onPress={() => setDropdownVisible(true)}>
                <Text style={containerStyles.frequencyInput}>{frequency}</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={textStyles.textBodyHeader}>Add a description:</Text>
          <TextInput
            style={containerStyles.biggerInput}
            multiline={true}
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
            placeholder="This is optional"
          />
        </View>
        <View style={{ ...containerStyles.buttonContainer, marginTop: "-8%" }}>
          <TouchableOpacity
            style={containerStyles.whiteButton}
            onPress={() => navigation.navigate("AddGoal")}
          >
            <Text style={textStyles.textBodyHeaderPurple}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={containerStyles.purpleButton}
            onPress={handleNewGoal}
            disabled={!isClickable}
          >
            <Text style={textStyles.textBodyHeaderWhite}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flex: 1, paddingBottom: "50%" }}></View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    backgroundColor: "white", // Background color of the dropdown container
    borderWidth: 1, // Border width
    borderColor: "black", // Border color
    borderRadius: 16, // Border radius
    marginTop: 5, // Margin from the text input
    width: 150, // Width of the dropdown container
    paddingHorizontal: "5%",
    display: "flex",
    maxHeight: 200,
  },
  option: {
    borderColor: "gray",
    padding: 12,
    borderRadius: 16,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});

export default AddRecurringGoalScreen;
