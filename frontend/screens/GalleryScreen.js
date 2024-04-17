import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { ImageManipulator, manipulateAsync } from "expo-image-manipulator";
import { Camera } from "expo-camera";
import { fetchUserImages } from "../backendFunctions.js";
import { textStyles, containerStyles } from "../styles/styles";
import back from "../assets/back_arrow.png";
import heart from "../assets/like.png";
import { Calendar, CalendarUtils } from "react-native-calendars";

const GalleryScreen = ({ route, navigation }) => {
  const { user } = useAuth();
  const [date, setDate] = useState("");
  const [username, setUsername] = useState(route.params.username);
  const [ready, setReady] = useState(false);
  const [allImages, setAllImages] = useState(null);
  const [dayImages, setDayImages] = useState([]);

  const getUserImages = async () => {
    const images = await fetchUserImages(user);
    setAllImages(images);
  };

  const getDayImages = async () => {
    const tempImages = [];
    for (const image of allImages) {
      console.log(image.timestampString);
      if (image.timestampString === date) {
        tempImages.push(image);
      }
    }
    console.log(tempImages);
    setDayImages(tempImages);
  };

  useEffect(() => {
    //console.log(new Date().toISOString().split('T')[0]);
    setDate(new Date().toISOString().split("T")[0]);
    getUserImages();
  }, []);

  useEffect(() => {
    if (allImages !== null) {
      setReady(true);
    }
  }, [allImages]);

  useEffect(() => {
    if (ready && date !== "") {
      getDayImages();
    }
  }, [ready, date]);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView style={containerStyles.background}>
      <View style={containerStyles.container}>
        <View style={containerStyles.headerContainer}>
          <Text style={textStyles.header}> Gallery </Text>
          <Text style={textStyles.textBodyGray}>View all your photos</Text>
        </View>
        <TouchableOpacity
          style={containerStyles.back}
          onPress={() => navigation.navigate("Profile")}
        >
          <Image source={back} />
        </TouchableOpacity>

        <View style={{ width: "100%" }}>
          <Calendar
            current={date}
            onDayPress={(day) => setDate(day.dateString)}
            theme={containerStyles.customCalendarTheme}
            style={styles.calendar}
            // markedDates={marked}
          />
        </View>

        <FlatList
          data={dayImages}
          keyExtractor={(item, index) => index.toString()}
          style={styles.container}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <View style={styles.title}>
                <Text style={textStyles.textBodyHeader}>{username}</Text>
                <Text style={textStyles.textBodySmall}>
                  {item.timestampString}
                </Text>
              </View>
              <Image source={{ url: item.imageUrl }} style={styles.image} />
              <View>
                <View>
                  <Image source={heart} />
                  <Text> {item.likes.length} </Text>
                </View>
                <Text>{item.caption}</Text>
              </View>
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  calendar: {
    borderRadius: 10,
    marginBottom: "7%",
  },
  container: {
    width: "100%",
    height: '1000%'
  },
  imageContainer: {
    padding: 10,
  },
  title: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  image: {
    width: "100%",
    height: '100%'
  },
});

export default GalleryScreen;
