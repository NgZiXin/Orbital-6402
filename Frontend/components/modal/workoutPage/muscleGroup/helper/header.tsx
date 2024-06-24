import { StyleSheet, View } from "react-native";

export default function MultiSelectHeader() {
  return <View style={styles.multiSelectHeader}></View>;
}

const styles = StyleSheet.create({
  multiSelectHeader: {
    height: 24,
    backgroundColor: "#CE879F",
    marginBottom: 10,
  },
});
