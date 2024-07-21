import { WebView } from "react-native-webview";
import { StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { getToken } from "@/utility/userToken";

export default function NearestGymPark() {
  const [token, setToken] = useState<string | null>(null);

  // On component mount, grab the user token string and store it
  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await getToken("token");
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
        uri: `${process.env.EXPO_PUBLIC_DOMAIN}map`,
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
