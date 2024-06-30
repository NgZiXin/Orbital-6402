// RenderChips.js
import { globalStyles } from "@/styles/global";
import React from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function CustomChips(props: any) {
  return (
    <View
      style={[styles.boxWrapper, { height: props.workoutModalHeight * 0.4 }]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity>
          <Text style={globalStyles.para}>Chest: Status</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={globalStyles.para}>
            Shoulders: Selected, no subgroups
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={globalStyles.para}>Arms: Selected, view subgroups </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={globalStyles.para}>Back: Status</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={globalStyles.para}>Core: Status</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={globalStyles.para}>Legs: Status</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  boxWrapper: {
    padding: 12,
    borderColor: "#bbb",
    borderWidth: 1,
    borderRadius: 8,
  },
});
