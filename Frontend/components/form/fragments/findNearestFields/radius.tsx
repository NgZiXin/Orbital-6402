import { Slider } from "@react-native-assets/slider";
import { StyleSheet, Text, View } from "react-native";
import { globalStyles } from "../../../../styles/global";
import { formStyles } from "@/styles/form";

export default function SearchRadiusField({ formikProps }: any) {
  return (
    <>
      <View style={formStyles.sliderFormCommon}>
        <View style={formStyles.sliderLabel}>
          <Text style={globalStyles.label}>Search radius (km):</Text>
          <Text style={styles.text}>{formikProps.values.radius}</Text>
        </View>

        <Slider
          style={formStyles.slider}
          minimumValue={0.5}
          maximumValue={5}
          trackHeight={3}
          step={0.5}
          value={formikProps.values.radius}
          thumbSize={16.5}
          minimumTrackTintColor="#FFC4C4" // Change the color of the filled part
          maximumTrackTintColor="#D0D0D0" // Change the color of the unfilled part
          thumbTintColor="#FFC4C4"
          onValueChange={(value) => {
            formikProps.setFieldValue("radius", value);
          }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  text: {
    ...globalStyles.label,
    left: 5,
  },
});
