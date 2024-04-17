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
  const [isClicked, setIsClicked] = useState(false);

  const getUserImages = async () => {
    const images = await fetchUserImages(user);
    setAllImages(images);
  };

  const getDayImages = async () => {
    const tempImages = [];
    const isClickedArray = [];
    for (const image of allImages) {
      if (image.timestampString === date) {
        tempImages.push(image);
        isClickedArray.push(false);
      }
    }
    console.log(tempImages);
    setIsClicked(isClickedArray);
    setDayImages(tempImages);
  };

  const handleSwap = async (day) => {
    setDate(day.dateString);
  };

  const handleClick = () => {
    setIsClicked(!isClicked);
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

        {dayImages.length > 0 && (
          <FlatList
            data={dayImages}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
            style={{ width: "100%", height: 500 * dayImages.length }}
            renderItem={({ item }) => (
              <View style={styles.imageContainer}>
                <View style={styles.title}>
                  <Text style={textStyles.textBodyHeader}>{username}</Text>
                  <Text style={textStyles.textBodySmall}>
                    {item.timestampString}
                  </Text>
                </View>
                <TouchableOpacity onPress={handleClick} activeOpacity={0.9}>
                  <Image source={{ url: item.imageUrl }} style={styles.image} />
                  {isClicked && <View style={styles.clickedImage} />}
                </TouchableOpacity>
                {isClicked && (
                  <View style={styles.overlay}>
                    <Text style={textStyles.subheaderWhite}>
                      Tagged Goals
                    </Text>
                    {item.goals.map((item, index) => (
                      <View style={styles.goal}>
                        <Text style={{...textStyles.textBodyHeaderWhite, textAlign: 'left'}}> {item} </Text>
                      </View>
                    ))}
                  </View>
                )}
                <View style={styles.bottomHalf}>
                  <View style={styles.likes}>
                    <Image source={heart} />
                    <Text style={textStyles.textBodyHeaderPurpleBold}>
                      {item.likes.length}
                    </Text>
                  </View>
                  <View style={styles.caption}>
                    <Text style={textStyles.textBodySmall}>{item.caption}</Text>
                    <Text
                      style={{ ...textStyles.textBodySmall, color: "#8E99AB" }}
                    >
                      Tap photo to view associated goals
                    </Text>
                  </View>
                </View>
              </View>
            )}
          />
        )}
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
  imageContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    marginVertical: "2%",
  },
  title: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    padding: 5,
    borderWidth: 1,
    borderColor: "#8E99AB",
  },
  image: {
    width: "100%",
    height: 300,
  },
  clickedImage: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  bottomHalf: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-around",
    paddingVertical: "2%",
    paddingHorizontal: '2%',
    borderWidth: 1,
    borderColor: "#8E99AB",
  },
  likes: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  caption: {
    paddingRight: "15%",
  },
  overlay: {
    position: "absolute",
    top: "15%", // Adjust position as needed
    left: "10%", // Adjust position as needed
    color: "white",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "white",
    zIndex: 10, // Ensure text appears above the image,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 10,
    width: '80%',
    height: '50%'
  },
  goal: {
    width: '90%',
    paddingHorizontal: '1%',
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "white",
  }
});

export default GalleryScreen;
