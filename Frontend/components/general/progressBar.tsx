import { DimensionValue, StyleSheet, Text, View } from "react-native";
import { globalStyles } from "@/styles/global";

interface ProgressBarProps {
  leftLabel: string;
  rightLabel: string;
  progress: DimensionValue;
}

export default function ProgressBar({
  leftLabel,
  rightLabel,
  progress,
}: ProgressBarProps) {
  return (
    <>
      <View style={styles.labels}>
        <Text style={globalStyles.para}>{leftLabel}</Text>
        <Text style={globalStyles.para}>{rightLabel}</Text>
      </View>
      <View style={styles.backgroundBar}>
        <View style={[styles.progressBar, { width: progress }]}></View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "relative",
    top: 8,
  },

  backgroundBar: {
    height: "3%",
    backgroundColor: "#E5E5E5",
    borderRadius: 7,
  },

  progressBar: {
    height: "100%",
    backgroundColor: "red",
    borderRadius: 7,
  },
});