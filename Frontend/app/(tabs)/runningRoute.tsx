import { WebView } from "react-native-webview";
import { StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { getItem } from "@/components/general/asyncStorage";

const ip = process.env.EXPO_PUBLIC_DOMAIN;

export default function runningRoute() {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await getItem("token");
      setToken(storedToken);
    };

    fetchToken();
  }, []);

  return token ? (
    <WebView
      style={styles.container}
      javaScriptEnabled={true}
      startInLoadingState={true}
      source={{
        uri: `${process.env.EXPO_PUBLIC_DOMAIN}/map`,
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
