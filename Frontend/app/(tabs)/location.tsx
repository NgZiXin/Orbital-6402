import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useState } from "react";
import {
  Image,
  Alert,
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";

import CustomTextInput from "@/components/general/customTextInput";
import { globalStyles } from "../../styles/global";
import PageHeader from "@/components/general/pageHeader";

interface GymInfo {
  name: string;
  latitude: number;
  longitude: number;
  distance: number;
  image: string;
}

export default function Location() {
  const [search, setSearch] = useState("");
  const [gymData, setGymData] = useState<GymInfo[]>([]);
  const [message, setMessage] = useState<string>("Result will be shown here");

  const [gym, setGym] = useState(false);
  const [park, setPark] = useState(false);

  const getNearestGyms = async (lat: number, lon: number, radius: number) => {
    const ip = process.env.EXPO_PUBLIC_DOMAIN;
    const response = await fetch(
      `http://${ip}:8000/services/find_gym/?lat=${lat}&lon=${lon}&radius=${radius}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      // TODO: Handle Error Response
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  };

  const searchHandler = () => {
    if (!gym && !park) {
      Alert.alert("Choose Gym or Park!");
    } else if (gym) {
      // Fetching data from the URL
      fetch(
        `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${search}&returnGeom=Y&getAddrDetails=Y&pageNum=1`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data["results"].length == 0) {
            Alert.alert("User Error", "Invalid Postal Code / Address input");
          } else {
            setMessage(
              `Searching for gym(s) around ${data["results"][0]["SEARCHVAL"]}`
            );
            getNearestGyms(
              data["results"][0]["LATITUDE"],
              data["results"][0]["LONGITUDE"],
              1000
            ).then((res: GymInfo[]) => {
              if (res.length == 0) {
                setMessage(
                  `No gym found within a 1km radius from ${data["results"][0]["SEARCHVAL"]}`
                );
              }
              setGymData(res);
            });
          }
        })
        .catch((error) => {
          // Logging any errors
          console.error("Error fetching data:", error);
        });
    }
  };

  const gymHandler = () => {
    setGym(!gym);
    setPark(false);
  };

  const parkHandler = () => {
    setPark(!park);
    setGym(false);
  };

  const renderItem = (item: GymInfo, index: number) => {
    return (
      <View style={globalStyles.cardV1} key={index}>
        <View style={styles.cardInner}>
          <Text style={{ ...globalStyles.header, fontFamily: "inter-bold" }}>
            {index + 1 + ")  " + item.name}
          </Text>
          <View style={styles.imageWrapper}>
            <Image style={styles.banner} source={{ uri: item.image }} />
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{ ...globalStyles.para, fontFamily: "inter-semibold" }}
            >
              Distance Away:{" "}
            </Text>
            <Text
              style={{ ...globalStyles.para, fontFamily: "inter-semibold" }}
            >
              {item.distance + " km"}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ ...globalStyles.container, padding: 12 }}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            <PageHeader topText="Finder" bottomText="Find Nearest Gym & Park" />

            <View style={[styles.searchWrapper, styles.extra]}>
              <CustomTextInput
                style={{ borderRadius: 7, width: "90%" }}
                placeholder="Your Location (Postal Code)"
                onChangeText={(newText: string) => setSearch(newText)}
                value={search}
              />

              <TouchableOpacity onPress={searchHandler}>
                <Ionicons
                  name="search-outline"
                  size={20}
                  style={{
                    position: "relative",
                    left: 5,
                    top: 1,
                  }}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.buttonsWrapper}>
              <TouchableOpacity
                onPress={gymHandler}
                style={[
                  styles.button,
                  gym ? styles.highlightedButton : undefined,
                ]}
              >
                <Text
                  style={{
                    ...globalStyles.para,
                    position: "relative",
                    right: 3,
                  }}
                >
                  Gym
                </Text>
                <MaterialIcons
                  name="sports-gymnastics"
                  size={20}
                  style={{
                    position: "relative",
                    left: 2,
                    top: 10,
                  }}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={parkHandler}
                style={[
                  styles.button,
                  { marginLeft: 10 },
                  park ? styles.highlightedButton : undefined,
                ]}
                disabled // TODO
              >
                <Text style={globalStyles.para}>Park</Text>
                <MaterialCommunityIcons
                  name="tree-outline"
                  size={20}
                  style={{
                    position: "relative",
                    left: 5,
                    top: 10,
                  }}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.gymParkResult}>
              <View style={globalStyles.cardV2}>
                <View
                  style={[
                    styles.cardInner,
                    gymData.length == 0 ? { height: 170 } : undefined,
                  ]}
                >
                  {/* Before search, searching, failed search */}
                  {gymData.length == 0 && (
                    <Text style={globalStyles.para}>{message}</Text>
                  )}
                  {gymData.length > 0 && <>{gymData.map(renderItem)}</>}
                </View>
              </View>
            </View>

            <PageHeader topText="" bottomText="Explore New Running Routes" />
            <View style={styles.runningRouteResult}>
              <View style={globalStyles.cardV2}>
                <View style={{ ...styles.cardInner, height: 170 }}>
                  <Text style={globalStyles.para}>
                    Result will be shown{" "}
                    <Text style={{ color: "red" }}>here</Text>
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  searchWrapper: {
    width: "100%",
    position: "relative",
    bottom: 17,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  extra: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 7,
    padding: 10,
  },

  buttonsWrapper: {
    flexDirection: "row",
    position: "relative",
    bottom: 8,
    alignItems: "center",
    marginBottom: 30,
    // fixed height
    // so that when height slightly changes onActiveState
    // elements below do not shift down
    height: 43,
  },

  button: {
    flexDirection: "row",
    justifyContent: "center",
    width: "33%",
    backgroundColor: "#F6F2F2",
    borderRadius: 10,
  },

  highlightedButton: {
    borderColor: "red",
    borderWidth: 1,
  },

  gymParkResult: {
    position: "relative",
    bottom: 10,
    marginBottom: 38,
  },

  cardInner: {
    height: "auto",
    width: "100%",
    padding: 7,
  },

  runningRouteResult: {
    position: "relative",
    bottom: 15,
  },

  imageWrapper: {
    height: 200,
    width: "100%",
  },

  banner: {
    flex: 1,
    height: null,
    width: null,
    resizeMode: "cover",
  },
});
