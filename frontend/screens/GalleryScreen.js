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
      if (image.timestampString === date) {
        tempImages.push(image);
      }
    }
    setDayImages(tempImages);
  };

  const handleSwap = async (day) => {
    setDate(day.dateString);
  }

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
    <ScrollView style={{ ...containerStyles.background, height: "500%" }}>
      <View style={{ ...containerStyles.container, marginHorizontal: 0 }}>
        <View style={{ width: "90%" }}>
          <View style={containerStyles.headerContainer}>
            <Text style={textStyles.header}> Your Gallery </Text>
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
              initialDate={new Date().toISOString().split("T")[0]}
              current={date}
              onDayPress={(day) => handleSwap(day)}
              theme={containerStyles.customCalendarTheme}
              style={styles.calendar}
              // markedDates={marked}
            />
          </View>
        </View>
        <FlatList
          data={dayImages}
          keyExtractor={(item, index) => index.toString()}
          scrollEnabled={false}
          style={{ width: "100%", height: 500 * allImages.length, borderWidth: 1, borderColor: '#8E99AB' }}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <View style={styles.title}>
                <Text style={textStyles.textBodyHeader}>{username}</Text>
                <Text style={textStyles.textBodySmall}>
                  {item.timestampString}
                </Text>
              </View>
              <Image source={{ url: item.imageUrl }} style={styles.image} />
              <View style={styles.bottomHalf}>
                <View style={styles.likes}>
                  <Image source={heart} />
                  <Text style={textStyles.textBodyHeaderPurple}>
                    {item.likes.length}
                  </Text>
                </View>
                <Text style={textStyles.textBodySmall}>{item.caption}</Text>
              </View>
            </View>
          )}
        />
        <View style={{ marginBottom: "10%" }} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  calendar: {
    borderRadius: 10,
    marginBottom: "15%",
  },
  title: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    padding: 5,
  },
  image: {
    width: "100%",
    height: "100%",
    marginVertical: "1%",
  },
  likes: {
    display: "flex",
    flexDirection: 'column',
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  bottomHalf: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
});

export default GalleryScreen;
