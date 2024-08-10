import { Text, View, StyleSheet } from "react-native";
import { globalStyles } from "../../../../../styles/global";
import { formStyles } from "@/styles/form";
import CustomTextInput from "@/components/general/customTextInput";

export default function DurationSetter({ formikProps }: any) {
  return (
    <View style={formStyles.sliderFormCommon}>
      <View style={globalStyles.container}>
        <Text style={globalStyles.label}>
          Target Finish Time (hours : minutes : seconds)
        </Text>
        <View style={styles.timerWrapper}>
          <CustomTextInput
            style={styles.timeInput}
            placeholder={"01"}
            onChangeText={formikProps.handleChange("duration_hours")}
            value={formikProps.values.hours}
            keyboardType="numeric"
          />
          <Text style={styles.timeLabel}>h</Text>
          <Text style={styles.timeDivider}>:</Text>
          <CustomTextInput
            style={styles.timeInput}
            placeholder={"00"}
            onChangeText={formikProps.handleChange("duration_minutes")}
            value={formikProps.values.minutes}
            keyboardType="numeric"
          />
          <Text style={styles.timeLabel}>m</Text>
          <Text style={styles.timeDivider}>:</Text>
          <CustomTextInput
            style={styles.timeInput}
            placeholder={"00"}
            onChangeText={formikProps.handleChange("duration_seconds")}
            value={formikProps.values.seconds}
            keyboardType="numeric"
          />
          <Text style={styles.timeLabel}>s</Text>
        </View>
        {/* Display validation errors */}
        {formikProps.errors.duration_hours && (
          <Text style={formStyles.errorText}>
            {formikProps.errors.duration_hours}
          </Text>
        )}
        {formikProps.errors.duration_minutes && (
          <Text style={formStyles.errorText}>
            {formikProps.errors.duration_minutes}
          </Text>
        )}
        {formikProps.errors.duration_seconds && (
          <Text style={formStyles.errorText}>
            {formikProps.errors.duration_seconds}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  timerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    marginRight: 8,
  },
  timeInput: {
    ...globalStyles.input,
    textAlign: "center",
    width: 40,
  },
  timeLabel: {
    ...globalStyles.para,
    paddingHorizontal: 2,
  },
  timeDivider: {
    ...globalStyles.para,
    paddingHorizontal: 5,
    fontSize: 20,
  },
});
