import { Slider } from "@react-native-assets/slider";
import { StyleSheet, Text, View } from "react-native";
import { globalStyles } from "../../styles/global";

export default function NumExercise({ formikProps }: any) {
  return (
    <>
      <View>
        <View style={styles.mainLabel}>
          <Text style={[globalStyles.para, globalStyles.label]}>
            Number of Exercises:
          </Text>
          <Text
            style={{ ...globalStyles.para, ...globalStyles.label, left: 5 }}
          >
            {formikProps.values.numExercise}
          </Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={3}
          maximumValue={12}
          trackHeight={3.5}
          step={1}
          value={formikProps.values.numExercise}
          minimumTrackTintColor="#F5BABA"
          maximumTrackTintColor="#D0D0D0"
          thumbTintColor="#F5BABA"
          onValueChange={(value) =>
            formikProps.setFieldValue("numExercise", value)
          }
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  mainLabel: {
    flexDirection: "row",
    alignItems: "center",
  },

  slider: {
    width: "100%",
    height: 30,
    position: "relative",
    right: 15,
  },
});
