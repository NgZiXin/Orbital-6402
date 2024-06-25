import { WebView } from "react-native-webview";
import { StyleSheet } from "react-native";

export default function App() {
  return (
    <WebView
      style={styles.container}
      javaScriptEnabled={true}
      startInLoadingState={true}
      source={{ uri: "http://192.168.50.37:8000/map" }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
