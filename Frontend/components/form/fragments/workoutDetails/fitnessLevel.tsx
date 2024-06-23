import { Slider } from "@react-native-assets/slider";
import { StyleSheet, Text, View } from "react-native";
import { globalStyles } from "../../../../styles/global";

export default function FitnessLevel({ formikProps, setScroll }: any) {
  return (
    <>
      <View style={{ marginBottom: 12 }}>
        <View style={styles.mainLabel}>
          <Text style={globalStyles.label}>Level of Fitness:</Text>
          <Text style={{ ...globalStyles.label, left: 5 }}>
            {formikProps.values.fitnessLevel}
          </Text>
        </View>

        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={10}
          trackHeight={3.5}
          step={1}
          thumbSize={16.5}
          minimumTrackTintColor="#F5BABA" // Change the color of the filled part
          maximumTrackTintColor="#D0D0D0" // Change the color of the unfilled part
          thumbTintColor="#F5BABA"
          onSlidingStart={(value) => setScroll(false)}
          onSlidingComplete={(value) => setScroll(true)}
          onValueChange={(value) => {
            formikProps.setFieldValue("fitnessLevel", value);
          }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  mainLabel: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: -5,
  },

  slider: {
    paddingVertical: 10,
    width: "90%",
    height: 30,
  },
});
