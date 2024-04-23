import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import { textStyles, containerStyles } from "../styles/styles";
import { useAuth } from "../contexts/AuthContext";
import { editGoal, fetchAGoal } from "../backendFunctions";
import { Calendar } from "react-native-calendars";

import calendarIcon from "../assets/calendar.png";

const EditLongTermGoalScreen = ({ navigation, route }) => {
  const { user } = useAuth();
  const { goalName } = route.params;

  const [goal, setGoal] = useState(null); // State to store fetched goal
  const [newName, setNewName] = useState("");
  const [type, setType] = useState("Long Term");
  const [date, setDate] = useState(new Date());
  const [counter, setCounter] = useState(1); // [1]
  const [description, setDescription] = useState("");
  const [isClickable, setIsClickable] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);

  const { width: screenWidth } = Dimensions.get("window");

  useEffect(() => {
    const fetchUserGoal = async () => {
      try {
        const fetchedGoal = await fetchAGoal(user, goalName);
        setGoal(fetchedGoal);

        // Once the goal is fetched, set the new values
        setNewName(fetchedGoal.name);
        setType(fetchedGoal.type);
        setCounter(fetchedGoal.counter);
        setDate(fetchedGoal.date);
        setDescription(fetchedGoal.description);
      } catch (error) {
        console.error("Error fetching goal:", error);
      }
    };

    fetchUserGoal(); // Call the async function
  }, [user, goalName]);

  const toggleShowCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const handleEditGoal = async () => {
    setIsClickable(false);

    // Check if deadline and name are filled out and throw alert if not
    if (!newName || !date) {
      Alert.alert("Name and deadline are required fields.");
      setIsClickable(true);
      return;
    }

    console.log("Editing goal...");
    // print all data
    console.log("Name: " + newName);
    console.log("ID: " + goal.id);
    console.log("Type: " + type);
    console.log("Counter: " + counter);
    console.log("Date: " + date);
    console.log("Description: " + description);
    // im done bruh

    const success = await editGoal(
      user,
      goal.id,
      newName,
      type,
      counter,
      date,
      description
    );

    if (success) {
      console.log("Goal edited successfully");
      navigation.navigate("Goals");
    } else {
      setIsClickable(true);
      console.log("Error editing goal. Try again");
    }
  };

  return (
    <ScrollView style={containerStyles.background}>
      <View style={containerStyles.container}>
        <View style={containerStyles.headerContainer}>
          <Text style={textStyles.header}>Long Term Goal</Text>
          <Text style={textStyles.textBodyGray}>Edit your long term goal</Text>
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

          <Text style={textStyles.textBodyHeader}>Edit target date:</Text>
          <TextInput
            style={[containerStyles.dateInput, textStyles.textBodyHeaderWhite]}
            value={date}
            onChangeText={setDate}
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={{ position: "absolute", top: "52%", left: "85%" }}
            onPress={toggleShowCalendar}
          >
            <View style={styles.imageContainer}>
              <Image source={calendarIcon} style={styles.image} />
            </View>
          </TouchableOpacity>

          {/* Render the calendar as an overlay */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={showCalendar}
            onRequestClose={() => toggleShowCalendar()}
          >
            <View
              style={[
                containerStyles.modalContainer,
                {
                  width: screenWidth * 0.95,
                  paddingTop: "115%",
                  paddingLeft: "5%",
                },
              ]}
            >
              <View style={{ borderRadius: 20, overflow: "hidden" }}>
                <View style={containerStyles.modalContent}>
                  <Calendar
                    current={date}
                    minDate={new Date()} // Set minimum date to today
                    onDayPress={(day) => {
                      setDate(day.dateString); // Update selected date
                      setShowCalendar(false); // Close the calendar
                    }}
                    theme={containerStyles.customCalendarTheme} // Apply the custom theme
                    borderRadius={200} // Apply border radius to the Calendar component
                  />
                </View>
              </View>
            </View>
          </Modal>

          <Text style={textStyles.textBodyHeader}>Edit description:</Text>
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
  // IMAGE STYLING
  image: {
    width: "60%", // Adjust image size relative to the container
    height: "60%", // Adjust image size relative to the container
  },
  imageContainer: {
    width: 35, // Adjust width as needed
    height: 35, // Adjust height as needed
    borderRadius: 50, // Half of width or height to make it a circle
    backgroundColor: "white",
    borderColor: "black", // Optional border color
    justifyContent: "center", // Center the image
    alignItems: "center", // Center the image
  },
  frequencyButton: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 5,
    backgroundColor: "transparent",
  },
  selectedButton: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 5,
    backgroundColor: "darkpurple",
  },
});

export default EditLongTermGoalScreen;
