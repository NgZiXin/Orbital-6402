import { Slider } from "@react-native-assets/slider";
import { StyleSheet, Text, View } from "react-native";
import { globalStyles } from "../../../../styles/global";

export default function NumExercise({ formikProps, setScroll }: any) {
  return (
    <>
      <View style={{ marginBottom: 12 }}>
        <View style={styles.mainLabel}>
          <Text style={globalStyles.label}>Number of Exercises:</Text>
          <Text style={{ ...globalStyles.label, left: 5 }}>
            {formikProps.values.numExercise}
          </Text>
        </View>

        <Slider
          style={styles.slider}
          minimumValue={3}
          maximumValue={12}
          trackHeight={3.5}
          step={1}
          thumbSize={16.5}
          minimumTrackTintColor="#F5BABA"
          maximumTrackTintColor="#D0D0D0"
          thumbTintColor="#F5BABA"
          onSlidingStart={(value) => setScroll(false)}
          onSlidingComplete={(value) => setScroll(true)}
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
    width: "90%",
    height: 30,
  },
});
