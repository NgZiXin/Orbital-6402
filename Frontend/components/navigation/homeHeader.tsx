import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { globalStyles } from "@/styles/global";
import Header from "./header";

// Fix the any later based on ChatGPT
export default function HomeHeader({ navigation }: any) {
  return (
    <View>
      <Header
        navigation={navigation}
        style={{ position: "relative", top: 21 }}
      />
      <View style={styles.topNavigationWrapper}>
        <TouchableOpacity
          style={styles.topNavigation}
          onPress={() => navigation.navigate("home")}
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
    </View>
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
