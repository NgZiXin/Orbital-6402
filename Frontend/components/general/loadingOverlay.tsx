import React from "react";
import { View, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useLoading } from "@/hooks/useLoading";

export default function LoadingOverlay() {
  const { loading, hideLoading } = useLoading();
  const navigation: any = useNavigation();

  useEffect(() => {
    if (loading) {
      const timeout = setTimeout(() => {
        hideLoading();
        Alert.alert(
          "Error",
          "Network Response Error. Please Ensure stable connection"
        );

        // Redirect user to login page after 30 seconds
        navigation.navigate("login");
      }, 30000);

      return () => clearTimeout(timeout);
    }
  }, [loading]);

  if (!loading) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#FFC4C4" />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    // Semi-transparent background
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
});
