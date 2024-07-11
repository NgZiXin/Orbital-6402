import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { globalStyles } from "../../../../../styles/global";
import { formStyles } from "@/styles/form";

export default function DurationPicker({ formikProps }: any) {
  const incrementValue = (value: number, min: number, max: number) =>
    value < max ? value + 1 : min;
  const decrementValue = (value: number, min: number, max: number) =>
    value > min ? value - 1 : max;

  return (
    <View style={formStyles.workoutDetailsFormCommon}>
      <View style={globalStyles.container}>
        <Text style={globalStyles.label}>
          Target Finish Time (hours : minutes : seconds)
        </Text>
        <View style={styles.timePicker}>
          <View style={styles.timeControl}>
            <TouchableOpacity
              onPress={() =>
                formikProps.setFieldValue(
                  "duration_hours",
                  incrementValue(formikProps.values.duration_hours, 0, 23)
                )
              }
            >
              <Text style={styles.button}>▲</Text>
            </TouchableOpacity>

            <Text style={styles.time}>
              {String(formikProps.values.duration_hours).padStart(2, "0")}
            </Text>

            <TouchableOpacity
              onPress={() =>
                formikProps.setFieldValue(
                  "duration_hours",
                  decrementValue(formikProps.values.duration_hours, 0, 23)
                )
              }
            >
              <Text style={styles.button}>▼</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.timeLabel}>h</Text>

          <Text style={styles.timeDivider}>:</Text>

          <View style={styles.timeControl}>
            <TouchableOpacity
              onPress={() =>
                formikProps.setFieldValue(
                  "duration_minutes",
                  incrementValue(formikProps.values.duration_minutes, 0, 59)
                )
              }
            >
              <Text style={styles.button}>▲</Text>
            </TouchableOpacity>
            <Text style={styles.time}>
              {String(formikProps.values.duration_minutes).padStart(2, "0")}
            </Text>
            <TouchableOpacity
              onPress={() =>
                formikProps.setFieldValue(
                  "duration_minutes",
                  decrementValue(formikProps.values.duration_minutes, 0, 59)
                )
              }
            >
              <Text style={styles.button}>▼</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.timeLabel}>m</Text>
          <Text style={styles.timeDivider}>:</Text>

          <View style={styles.timeControl}>
            <TouchableOpacity
              onPress={() =>
                formikProps.setFieldValue(
                  "duration_seconds",
                  incrementValue(formikProps.values.duration_seconds, 0, 59)
                )
              }
            >
              <Text style={styles.button}>▲</Text>
            </TouchableOpacity>
            <Text style={styles.time}>
              {String(formikProps.values.duration_seconds).padStart(2, "0")}
            </Text>
            <TouchableOpacity
              onPress={() =>
                formikProps.setFieldValue(
                  "duration_seconds",
                  decrementValue(formikProps.values.duration_seconds, 0, 59)
                )
              }
            >
              <Text style={styles.button}>▼</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.timeLabel}>s</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  timePicker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,

  },
  timeControl: {
    alignItems: "center",
  },
  time: {
    ...globalStyles.para,
    textAlign: "center",
    width: 20,
    backgroundColor: "#E5E4E2",
  },
  timeLabel: {
    ...globalStyles.para,
    textAlign: "center",
    width: 15,
  },
  timeDivider: {
    ...globalStyles.label,
    textAlign: "center",
    fontWeight: "bold",
    marginLeft: 10,
    marginRight: 15,
  },
  button: {
    ...globalStyles.label,
    marginVertical: +2,
    fontSize: 20,
  },
});
