import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  RefreshControl,
  Platform,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { ImageManipulator, manipulateAsync } from "expo-image-manipulator";
import { Camera } from "expo-camera";
import { useAuth } from "../contexts/AuthContext";
import {
  fetchGroupImages,
  fetchRecentGroupImages,
  addImageToDatabase,
  addToBucket,
} from "../backendFunctions.js";
import { textStyles, containerStyles } from "../styles/styles";
import window from "../assets/window.png";

const NoGroupFeedScreen = ({navigation}) => {
  return (
    <View style={containerStyles.background}>
      <View style={containerStyles.container}>
        <View style={containerStyles.headerContainer}>
          <Text style={textStyles.header}>Your Feed</Text>
        </View>
        <Image source={window} />
        <Text style={{...textStyles.textBodyGray, width: '80%', marginVertical: '2%'}}>
          It’s a little empty in here, join a group to see what your friends are
          up to!
        </Text>
        <TouchableOpacity
          style={containerStyles.purpleButton}
          onPress={() => navigation.navigate("GroupStack")}
        >
          <Text style={textStyles.textBodyHeaderWhite}> Join/Create a group </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NoGroupFeedScreen;
