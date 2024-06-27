import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { globalStyles } from "@/styles/global";
import Header from "./header";
import { useIsFocused } from "@react-navigation/native";

export default function HomeHeader({ navigation, route }: any) {
  const isFocused = useIsFocused();
  React.useEffect(() => {
    if (isFocused) {
      console.log(route.name);
      // ref/state var to store this
    }
  }, [isFocused, route.name]);
  return (
    <>
      <Header
        navigation={navigation}
        style={{ position: "relative", top: 21 }}
      />
      <View style={styles.topNavigationWrapper}>
        <TouchableOpacity
          style={styles.topNavigation}
          onPress={() => navigation.navigate("stats")}
        >
          <Text style={{ ...globalStyles.para, fontSize: 14 }}>
            Visualization
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.topNavigation}
          onPress={() => navigation.navigate("calendar")}
        >
          <Text style={{ ...globalStyles.para, fontSize: 14 }}>Calendar</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
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
});
