import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { globalStyles } from "@/styles/global";
import PageHeader from "@/components/general/pageHeader";

export default function Stats() {
  return (
    <View style={{ ...globalStyles.container, padding: 12 }}>
      {/* For offset */}
      <View style={{ marginTop: 35 }}>
        <PageHeader topText="Summary" bottomText="Weekly Performance" />
      </View>
    </View>
  );
}
