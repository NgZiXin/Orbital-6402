import { DimensionValue, StyleSheet, Text, View } from "react-native";
import { globalStyles } from "@/styles/global";

interface ProgressBarProps {
  leftLabel: number;
  rightLabel: number;
  progress: number;
}

export default function ProgressBar({
  leftLabel,
  rightLabel,
  progress,
}: ProgressBarProps) {
  // Convert progress value into percentage
  let percentage = null;
  if (progress > 100) {
    percentage = 100;
  } else if (progress < 0 || progress === undefined) {
    percentage = 0;
  } else {
    percentage = progress;
  }

  const percentageString: DimensionValue = `${percentage}%`;

  return (
    <>
      <View style={styles.labels}>
        <Text style={globalStyles.para}>{leftLabel}</Text>
        <Text style={globalStyles.para}>{rightLabel}</Text>
      </View>
      <View style={styles.backgroundBar}>
        <View style={[styles.progressBar, { width: percentageString }]}></View>
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
