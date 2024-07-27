import { Slider } from "@react-native-assets/slider";
import { Text, View } from "react-native";
import { globalStyles } from "../../../../../styles/global";
import { formStyles } from "@/styles/form";

export default function WeekSlider({ formikProps, setScroll }: any) {
  return (
    <>
      <View style={formStyles.sliderFormCommon}>
        <View style={formStyles.sliderLabel}>
          <Text style={globalStyles.label}>No. of weeks to Race Day:</Text>
          <Text style={{ ...globalStyles.label, left: 5 }}>
            {formikProps.values.weeks}
          </Text>
        </View>

        <Slider
          style={formStyles.slider}
          minimumValue={1}
          maximumValue={12}
          trackHeight={3}
          step={1}
          value={formikProps.values.weeks}
          thumbSize={16.5}
          minimumTrackTintColor="#FFC4C4" // Change the color of the filled part
          maximumTrackTintColor="#D0D0D0" // Change the color of the unfilled part
          thumbTintColor="#FFC4C4"
          onSlidingStart={(value) => setScroll(false)}
          onSlidingComplete={(value) => setScroll(true)}
          onValueChange={(value) => {
            formikProps.setFieldValue("weeks", value);
          }}
        />
      </View>
    </>
  );
}
