import { WebView } from "react-native-webview";
import { StyleSheet } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { getToken } from "@/utility/userToken";
import { useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

export default function NearestGymPark() {
  const [token, setToken] = useState<string | null>(null);
  const [isWebViewVisible, setIsWebViewVisible] = useState<boolean>(false);

  // Fetch the params passed into this screen
  const { uri } = useLocalSearchParams();

  // On component mount, grab the user token string and store it
  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await getToken("token");
      setToken(storedToken);
    };

    fetchToken();
  }, []);

  useFocusEffect(
    useCallback(() => {
      // When this screen is focused, make WebView visible
      setIsWebViewVisible(true);

      // When this screen is unfocused (ie: user navigates away)
      // Hide webview, forcing it to unmount
      // This prevents the user from seeing the old webview while the new webview is loading in!
      return () => {
        setIsWebViewVisible(false);
      };
    }, [])
  );

  return isWebViewVisible && token ? (
    <WebView
      style={styles.container}
      javaScriptEnabled={true}
      startInLoadingState={true}
      source={{
        uri: `${uri}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      }}
    />
  ) : (
    <></>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
