import { Text, View } from "react-native";
import { globalStyles } from "@/styles/global";

export default function Stats() {
  return (
    <View style={{ ...globalStyles.container, padding: 12 }}>
      {/* For offset */}
      <View style={{ marginTop: 40 }}>
        <Text>Calendar Page</Text>
      </View>
    </View>
  );
}
