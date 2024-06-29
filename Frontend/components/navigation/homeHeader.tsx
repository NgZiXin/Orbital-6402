import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { globalStyles } from "@/styles/global";
import Header from "./header";
import { useIsFocused } from "@react-navigation/native";

export default function HomeHeader({ navigation, route }: any) {
  // isFocused fluctuates alot between true and false
  // due to how expo handles page navigation
  // however, when its true, we must be either on stats or calendar page
  const isFocused: boolean = useIsFocused();

  return (
    <>
      <Header navigation={navigation} style={styles.originalHeader} />
      <View style={styles.topNavigationWrapper}>
        <TouchableOpacity
          style={styles.topNavigation}
          onPress={() => navigation.navigate("stats")}
        >
          <Text style={styles.text}>Visualization</Text>
          {isFocused && route.name == "stats" && (
            <View style={styles.underline} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.topNavigation}
          onPress={() => navigation.navigate("calendar")}
        >
          <Text style={styles.text}>Calendar</Text>
          {isFocused && route.name == "calendar" && (
            <View style={styles.underline} />
          )}
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  originalHeader: {
    position: "relative",
    top: 21,
  },

  topNavigationWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "relative",
    top: 50,
  },

  topNavigation: {
    width: "48%",
    alignItems: "center",
  },

  text: {
    ...globalStyles.para,
    fontSize: 14,
  },

  underline: {
    position: "relative",
    marginTop: -6,
    height: 2,
    backgroundColor: "red",
    width: "50%",
  },
});
