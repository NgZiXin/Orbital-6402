import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import AboutModal from "../modal/general/about";
import Ionicons from "@expo/vector-icons/Ionicons";

interface HeaderProps {
  navigation: any;
  style?: StyleProp<ViewStyle>;
}

export default function Header({ navigation, style }: HeaderProps) {
  const accountPage = (): void => {
    navigation.navigate("profile");
  };

  return (
    <View style={[styles.header, style]}>
      <AboutModal />
      <Text style={styles.headerText}>Workout Wizards!</Text>
      <Ionicons
        size={25}
        name="person-circle-outline"
        onPress={accountPage}
        style={styles.icon}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#E5E5E5",
  },

  headerText: {
    fontFamily: "inter-bold",
    fontWeight: "bold",
    fontSize: 17,
    color: "#333",
    letterSpacing: 1,
  },

  icon: {
    paddingTop: 2,
  },
});
