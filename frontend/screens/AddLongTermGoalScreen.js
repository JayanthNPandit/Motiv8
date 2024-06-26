// add recurring goal screen

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  ImageComponent,
  Alert,
  ScrollView,
  Dimensions,
} from "react-native";
import { textStyles, containerStyles } from "../styles/styles";
import { useAuth } from "../contexts/AuthContext";
import { addGoal } from "../backendFunctions";
import { Calendar } from "react-native-calendars";

import calendarIcon from "../assets/calendar.png";

const AddLongTermGoalScreen = ({ route, navigation }) => {
  const { disableNav } = route.params;
  const [goalName, setGoalName] = useState("");
  const [type, setType] = useState("Long Term");
  const [frequency, setFrequency] = useState("");
  const [counter, setCounter] = useState(1);
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [isClickable, setIsClickable] = useState(true);

  const { user } = useAuth();

  const { width: screenWidth } = Dimensions.get("window");

  const frequencies = ["Daily", "Weekly", "Monthly"];

  const [showCalendar, setShowCalendar] = useState(false);

  // function to add the entered goal to the backend
  const handleNewGoal = async () => {
    setIsClickable(false);
    // check if date, name are filled out and throw alert if not
    if (!goalName || !date) {
      Alert.alert("Name and date are required fields.");
      setIsClickable(true);
      return;
    }

    const id = await addGoal(
      user,
      goalName,
      type,
      frequency,
      counter,
      date,
      description
    );
    if (!id) {
      setIsClickable(true);
      console.log("Error adding goal. Try again");
    } else {
      setGoalName("");
      setFrequency("");
      setDescription("");
      setIsClickable(true);
    }

    if (disableNav) navigation.navigate("Goals");
    else navigation.navigate("Groups");
  };

  const toggleShowCalendar = () => {
    setShowCalendar(!showCalendar);
    console.log("current date:" + date);
  };

  return (
    <ScrollView style={containerStyles.background}>
      <View style={containerStyles.container}>
        <View style={containerStyles.headerContainer}>
          <Text style={textStyles.header}> Add a Long Term Goal </Text>
          <Text style={textStyles.textBodyGray}>
            You can always change this later!
          </Text>
        </View>

        <View style={containerStyles.purpleInputContainer}>
          <Text style={textStyles.textBodyHeader}>
            Enter a name for your goal:
          </Text>
          <TextInput
            style={containerStyles.input}
            value={goalName}
            onChangeText={setGoalName}
            maxLength={20}
          />

          <Text style={textStyles.textBodyHeader}> Choose a goal type: </Text>
          <TextInput
            style={{ ...containerStyles.input, backgroundColor: "#E8EFFF" }}
            value={type}
            onChangeText={setType}
            editable={false}
          />

          <Text style={textStyles.textBodyHeader}> Pick a Target Date: </Text>
          <TextInput
            style={[containerStyles.dateInput, textStyles.textBodyHeaderWhite]}
            value={date}
            onChangeText={setDate}
            editable={false}
            defaultValue="Choose a date"
          />

          <TouchableOpacity
            style={{ position: "absolute", top: "52%", left: "85%" }}
            onPress={() => toggleShowCalendar()}
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

          <Text style={textStyles.textBodyHeader}> Add a description: </Text>
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

export default AddLongTermGoalScreen;
