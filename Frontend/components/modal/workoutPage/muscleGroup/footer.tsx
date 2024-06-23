import { StyleSheet, Text, View } from "react-native";

export default function MultiSelectFooter({ getCount }: any) {
  return (
    <View style={styles.multiSelectFooter}>
      <Text style={styles.displayText}>
        {getCount()} main muscle group(s) selected
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  multiSelectFooter: {
    height: 60,
    padding: 12,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },

  displayText: {
    fontSize: 12.5,
    fontFamily: "inter-regular",
  },
});
