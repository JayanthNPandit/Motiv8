import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { ImageManipulator, manipulateAsync } from "expo-image-manipulator";
import { Camera } from "expo-camera";
import {
  fetchGroupImages,
  fetchRecentGroupImages,
  addImageToDatabase,
  addToBucket,
  fetchUserImages,
} from "../backendFunctions.js";
import { textStyles, containerStyles } from "../styles/styles";
import back from "../assets/back_arrow.png";
import heart from "../assets/like.png";
import { Calendar, CalendarUtils } from "react-native-calendars";

const GalleryScreen = ({ route, navigation }) => {
  const { user } = useAuth()

  const getDate = (date, count) => {
    const newDate = date.setDate(date.getDate() + count);
    return CalendarUtils.getCalendarDateString(newDate);
  };

  const getImages = async () => {
    const images = await fetchUserImages(user);
    const dates = await Promise.all(
      images.map((image) => getDate(image.timestamp, 0))
    );
    const uniqueDates = [...new Set(dates)];
    const markedDates = await Promise.all(
      uniqueDates.map((date) => {
        markedDates[date] = true;
      })
    );
    console.log(markedDates);
    setMarked(markedDates);
    setImages(images);
  };

  const updateImages = async () => {
    const newImages = [];
    await Promise.all(
      images.forEach((image) => {
        if (getDate(image.timestamp, 0) === date) {
          newImages.push(image);
        }
      })
    );
    setImagesForDay(newImages);
  };

  useEffect(() => {
    getImages();
  }, []);

  useEffect(() => {
    updateImages();
  }, [date]);

  const [date, setDate] = useState(getDate(new Date(), 0));
  const [username, setUsername] = useState(route.params.username);
  const [images, setImages] = useState([]);
  const [imagesForDay, setImagesForDay] = useState([]);
  const [marked, setMarked] = useState({});

  return (
    <View style={containerStyles.background}>
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
          data={imagesForDay}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedImage(item.url);
                setModalVisible(true);
              }}
            >
              <View>
                <View>
                  <Text>{username}</Text>
                  <Text>{getDate(item.timestamp, 0)}</Text>
                </View>
                <Image source={{ url: item.url }} style={styles.image} />
                <View>
                  <View>
                    <Image source={heart} />
                    <Text> {item.likes.length} </Text>
                  </View>
                  <Text>{item.caption}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  calendar: {
    borderRadius: 10,
  },
});

export default GalleryScreen;
