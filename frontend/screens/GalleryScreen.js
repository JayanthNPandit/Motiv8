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
  Touchable,
  Alert,
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
import download from "../assets/download.png";
import { Calendar, CalendarUtils } from "react-native-calendars";
import * as MediaLibrary from "expo-media-library";

const GalleryScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [date, setDate] = useState("");
  const [ready, setReady] = useState(false);
  const [allImages, setAllImages] = useState(null);
  const [markedImages, setMarkedImages] = useState(null);
  const [dayImages, setDayImages] = useState([]);
  const [isClicked, setIsClicked] = useState(false);

  const getUserImages = async () => {
    const images = await fetchUserImages(user);
    const markedTemp = {};
    for (const image of images) {
      markedTemp[image.timestampString] = {marked: true};
    }
    setAllImages(images);
    setMarkedImages(markedTemp);
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
  };

  const handleClick = () => {
    setIsClicked(!isClicked);
  };

  const handleSaveImage = async (imageUrl, imagePath) => {
    try {
      imagePath = imagePath + ".jpeg";
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === "granted") {
        const fileUrl = FileSystem.documentDirectory + imagePath;
        const downloadResumable = FileSystem.createDownloadResumable(
          imageUrl,
          fileUrl,
          {},
          false
        );
        const response = await downloadResumable.downloadAsync();
        console.log(response.uri);
        const asset = await MediaLibrary.createAssetAsync(response.uri);
        Alert.alert("Success!", "Image saved to camera roll");
      } else {
        Alert.alert(
          "Permission denied",
          "Unable to save image. Please grant permission to access the media library."
        );
      }
    } catch (error) {
      console.error("Error saving image:", error);
      Alert.alert("Error", "Failed to save image to camera roll");
    }
  };

  useEffect(() => {
    const now = new Date()
    let timestampString = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'America/New_York'  // Assuming UTC-5 corresponds to Eastern Time (adjust if necessary)
    }).format(now).split('/').reverse().join('-');
    const day = timestampString.substring(5,7);
    const month = timestampString.substring(8,10);
    timestampString = timestampString.substring(0,5) + month + '-' + day;
    setDate(timestampString);
    getUserImages();
  }, []);

  useEffect(() => {
    if (allImages !== null && markedImages !== null) {
      setReady(true);
      console.log(markedImages)
    }
  }, [allImages, markedImages]);

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
              markedDates={markedImages}
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
                  <Text style={textStyles.textBodyHeader}>{item.username}</Text>
                  <View style={styles.downloadContainer}>
                    <Text style={textStyles.textBodySmall}>
                      {item.timestampString}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        handleSaveImage(item.imageUrl, item.imagePath);
                      }}
                    >
                      <Image source={download} style={styles.download} />
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity onPress={handleClick} activeOpacity={0.9}>
                  <Image source={{ url: item.imageUrl }} style={styles.image} />
                  {isClicked && <View style={styles.clickedImage} />}
                </TouchableOpacity>
                {isClicked && (
                  <View style={styles.overlay}>
                    <Text style={textStyles.subheaderWhite}>Tagged Goals</Text>
                    {item.goals.map((item, index) => (
                      <View key={item} style={styles.goal}>
                        <Text
                          style={{
                            ...textStyles.textBodyHeaderWhite,
                            textAlign: "left",
                          }}
                        >
                          {item}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
                <View style={styles.bottomHalf}>
                  <View style={styles.likes}>
                    <Image source={heart}/>
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
  downloadContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  download: {
    width: 25,
    height: 25,
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
    paddingHorizontal: "2%",
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
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
    width: "80%",
    height: "50%",
  },
  goal: {
    width: "90%",
    paddingHorizontal: "1%",
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "white",
  },
});

export default GalleryScreen;
