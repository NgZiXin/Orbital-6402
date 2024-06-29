import { WebView } from "react-native-webview";
import { StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { getItem } from "@/utility/asyncStorage";
import { REACT_APP_DOMAIN } from "@env";

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await getItem("token");
      setToken(storedToken);
    };

    fetchToken();
  }, []);

  return (
    token ?
    <WebView
      style={styles.container}
      javaScriptEnabled={true}
      startInLoadingState={true}
      source={{
        uri: `http://${REACT_APP_DOMAIN}:8000/map`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      }}
    /> :
    <></>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
