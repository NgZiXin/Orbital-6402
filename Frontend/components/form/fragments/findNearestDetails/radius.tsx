import { Slider } from "@react-native-assets/slider";
import { Text, View } from "react-native";
import { globalStyles } from "../../../../styles/global";
import { formStyles } from "@/styles/form";

export default function RadiusSlider({ formikProps }: any) {
  return (
    <>
      <View style={formStyles.findNearestDetailsFormCommon}>
        <View style={formStyles.sliderLabel}>
          <Text style={globalStyles.label}>Radius of search (km):</Text>
          <Text style={{ ...globalStyles.label, left: 5 }}>
            {formikProps.values.radius}
          </Text>
        </View>

        <Slider
          style={formStyles.slider}
          minimumValue={0.5}
          maximumValue={5}
          trackHeight={3}
          value={formikProps.values.radius}
          step={0.5}
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
