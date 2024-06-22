import { Slider } from "@react-native-assets/slider";
import { StyleSheet, Text, View } from "react-native";
import { globalStyles } from "../../styles/global";

export default function FitnessLevel({ formikProps }: any) {
  return (
    <>
      <View>
        <View style={styles.mainLabel}>
          <Text style={[globalStyles.para, globalStyles.label]}>
            Level of Fitness:
          </Text>
          <Text
            style={{ ...globalStyles.para, ...globalStyles.label, left: 5 }}
          >
            {formikProps.values.fitnessLevel}
          </Text>
        </View>
        <View>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={10}
            trackHeight={3.5}
            step={1}
            value={formikProps.values.fitnessLevel}
            minimumTrackTintColor="#F5BABA" // Change the color of the filled track
            maximumTrackTintColor="#D0D0D0" // Change the color of the unfilled track
            thumbTintColor="#F5BABA" // Change the color of the slider thumb
            onValueChange={(value) =>
              formikProps.setFieldValue("fitnessLevel", value)
            }
          />
        </View>
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
