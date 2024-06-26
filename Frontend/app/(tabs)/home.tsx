import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { globalStyles } from "@/styles/global";
import { useNavigation } from "expo-router";

export default function Home() {
  const navigation: any = useNavigation();
  return (
    <View style={{ ...globalStyles.container, padding: 12 }}>
      {/* For offset */}
      <View style={{ marginTop: 40 }}>
        <Text>Home Page</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topNavigationWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  topNavigation: {
    width: "48%",
    alignItems: "center",
  },
});
