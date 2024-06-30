import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { WebView } from "react-native-webview";
import { useState } from "react";
import {
  Image,
  Alert,
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import CustomTextInput from "@/components/general/customTextInput";
import { globalStyles } from "../../styles/global";
import PageHeader from "@/components/general/pageHeader";
import SubmitButton from "@/components/general/submit";
import { useNavigation } from "expo-router";

interface GymInfo {
  name: string;
  latitude: number;
  longitude: number;
  distance: number;
  image: string;
}

export default function Location() {
  const navigation: any = useNavigation();

  const [search, setSearch] = useState("");
  const [query, setQuery] = useState<String | null>(null);
  const [webviewUri, setWebviewUri] = useState(
    `${process.env.EXPO_PUBLIC_DOMAIN}/services/`
  );

  const searchHandler = () => {
    if (!query) {
      Alert.alert("Choose Gym or Park!");
    } else {
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
          setWebviewUri(
            `${process.env.EXPO_PUBLIC_DOMAIN}/services/?type=${query}&lat=${data["results"][0]["LATITUDE"]}&lon=${data["results"][0]["LONGITUDE"]}&radius=3000`
          );
        })
        .catch((error) => {
          // Logging any errors
          console.error("Error fetching data:", error);
        });
    }
  };

  const gymHandler = () => {
    setQuery("gym");
  };

  const parkHandler = () => {
    setQuery("park");
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
    <ScrollView
      style={globalStyles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ padding: 12 }}>
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
              query == "gym" ? styles.highlightedButton : undefined,
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
              query == "park" ? styles.highlightedButton : undefined,
            ]}
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

        <View
          style={{
            ...globalStyles.cardV2,
            position: "relative",
            bottom: 10,
            marginBottom: 38,
          }}
        >
          <View style={[styles.cardInner, { height: 250 }]}>
            <WebView
              javaScriptEnabled={true}
              startInLoadingState={true}
              source={{
                uri: webviewUri,
              }}
            />
          </View>
        </View>

        <PageHeader topText="" bottomText="Explore Running Routes" />
        <Text style={styles.runningRoute}>
          Click on the button below to explore various cool running routes!
        </Text>
        <SubmitButton
          text="View Routes"
          onPressHandler={() => navigation.navigate("runningRoute")}
          style={{ marginTop: "-1%" }}
        />
      </View>
    </ScrollView>
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

  cardInner: {
    padding: 7,
  },

  runningRoute: {
    ...globalStyles.para,
    position: "relative",
    bottom: 20,
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
