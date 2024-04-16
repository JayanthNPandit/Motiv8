import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { textStyles, containerStyles } from "../styles/styles";
import { CommonActions } from "@react-navigation/native";
import image from "../assets/working-out-3.png";
import back from "../assets/back_arrow.png";
import { useAuth } from "../contexts/AuthContext";

const GroupsScreen = ({ route, navigation }) => {
  const {disableNav} = route.params;
  return (
    <View style={containerStyles.background}>
      <View style={containerStyles.container}>
        <View style={containerStyles.headerContainer}>
          <Text style={textStyles.header}>Find Your Friends</Text>
          <Text style={textStyles.textBodyGray}>Motiv8 Group Options</Text>
        </View>

        {!disableNav &&
        <TouchableOpacity
          style={containerStyles.back}
          onPress={() => navigation.navigate("Onboarding")}
        >
          <Image source={back} />
        </TouchableOpacity> }
        
        {!disableNav &&
        <TouchableOpacity
          style={containerStyles.skipForward}
          onPress={() =>
            navigation.dispatch(
              CommonActions.reset({ index: 0, routes: [{ name: "Tab" }] })
            )
          }
        >
          <Text
            style={{ ...textStyles.textBodySmallUnderline, color: "#8E99AB" }}
          >
            Skip
          </Text>
        </TouchableOpacity>}

        <Image style={styles.image} source={image} />
        <TouchableOpacity
          style={{ ...containerStyles.purpleButton, marginBottom: "0%" }}
          onPress={() => navigation.navigate("CreateGroup")}
        >
          <Text style={textStyles.textBodyHeaderWhite}> Create a group </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...containerStyles.whiteButton }}
          onPress={() => navigation.navigate("JoinGroup")}
        >
          <Text style={textStyles.textBodyHeaderPurple}> Join a group </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // IMAGE STYLING
  image: {
    width: "75%",
    height: "30%",
    margin: "5%",
  },
});

export default GroupsScreen;
