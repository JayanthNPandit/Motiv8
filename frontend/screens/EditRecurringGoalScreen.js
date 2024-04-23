import React, { useState, useEffect } from "react";
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
import { editGoal, fetchAGoal } from "../backendFunctions";
import { useRoute } from "@react-navigation/native";

const EditRecurringGoalScreen = ({ navigation }) => {
  const route = useRoute();
  const { user } = useAuth();

  const { goalName } = route.params;

  // new values for everything
  const [newName, setNewName] = useState("");
  const [newFrequency, setNewFrequency] = useState("");
  const [newCounter, setNewCounter] = useState();
  const [currentCounter, setCurrentCounter] = useState(); // State to store the current counter value
  const [newDate, setNewDate] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isClickable, setIsClickable] = useState(true);
  const [type, setType] = useState("Recurring");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const [goal, setGoal] = useState(null); // State to store fetched goal

  const frequencyOptions = ["Daily", "Weekly", "Monthly", "Yearly"];

  const fetchUserGoal = async () => {
    try {
      const fetchedGoal = await fetchAGoal(user, goalName);
      setGoal(fetchedGoal);
    } catch (error) {
      console.error("Error fetching goal:", error);
    }
  };

  useEffect(() => {
    const fetchUserGoal = async () => {
      try {
        const fetchedGoal = await fetchAGoal(user, goalName);
        setGoal(fetchedGoal);

        // Once the goal is fetched, set the new values
        setNewName(fetchedGoal.name);
        setNewFrequency(fetchedGoal.frequency);
        setNewCounter(fetchedGoal.counter);
        setCurrentCounter(fetchedGoal.currentCounter);
        setNewDate(fetchedGoal.date);
        setNewDescription(fetchedGoal.description);
      } catch (error) {
        console.error("Error fetching goal:", error);
      }
    };

    fetchUserGoal(); // Call the async function
  }, [user, goalName]);

  const handleEditGoal = async () => {
    if (!newName || !newFrequency || !newCounter) {
      Alert.alert("Name, frequency, and counter are required fields.");
      return;
    }

    if (newCounter < currentCounter) {
      Alert.alert(
        "New counter cannot be less than the current progress count, which is " +
          currentCounter +
          "."
      );
      return;
    }

    setIsClickable(false);
    const success = await editGoal(
      user,
      goal.id,
      newName,
      newFrequency,
      newCounter,
      newDate,
      newDescription
    );

    if (success) {
      console.log("Goal edited successfully");
      navigation.navigate("Goals");
    } else {
      setIsClickable(true);
      console.log("Error editing goal. Try again");
    }
  };

  const handleOptionSelect = (option) => {
    setNewFrequency(option);
    setDropdownVisible(false);
  };

  return (
    <ScrollView style={containerStyles.background}>
      <View style={containerStyles.container}>
        <View style={containerStyles.headerContainer}>
          <Text style={textStyles.header}>Recurring Goal</Text>
          <Text style={textStyles.textBodyGray}>
            Edit your recurring term goal
          </Text>
        </View>

        <View style={containerStyles.purpleInputContainer}>
          <Text style={textStyles.textBodyHeader}>Edit goal name:</Text>
          <TextInput
            style={containerStyles.input}
            value={newName}
            onChangeText={setNewName}
            maxLength={20}
          />

          <Text style={textStyles.textBodyHeader}>Goal type:</Text>
          <TextInput
            style={{ ...containerStyles.input, backgroundColor: "#E8EFFF" }}
            value={type}
            onChangeText={setType}
            editable={false}
          />

          <Text style={textStyles.textBodyHeader}>Edit frequency:</Text>
          <View style={containerStyles.buttonContainer}>
            <TextInput
              style={containerStyles.counterInput}
              value={newCounter}
              onChangeText={setNewCounter}
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
                <Text style={containerStyles.frequencyInput}>
                  {newFrequency}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={textStyles.textBodyHeader}>Edit description:</Text>
          <TextInput
            style={containerStyles.biggerInput}
            multiline={true}
            numberOfLines={4}
            value={newDescription}
            onChangeText={setNewDescription}
            placeholder="This is optional"
          />
        </View>
        <View style={{ ...containerStyles.buttonContainer, marginTop: "-8%" }}>
          <TouchableOpacity
            style={{ ...containerStyles.whiteButton, paddingHorizontal: "17%" }}
            onPress={() => navigation.navigate("Goals")}
          >
            <Text style={textStyles.textBodyHeaderPurple}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={containerStyles.purpleButton}
            onPress={handleEditGoal}
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

export default EditRecurringGoalScreen;
