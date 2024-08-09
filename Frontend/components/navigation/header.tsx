import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
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
  const goBack = (): void => {
    navigation.goBack();
  };

  return (
    <View style={[styles.header, style]}>
      <Ionicons
        name="arrow-back-circle-outline"
        size={25}
        onPress={goBack}
        style={styles.icon}
      />
      <AboutModal />
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

  icon: {
    paddingTop: 2,
  },
});
