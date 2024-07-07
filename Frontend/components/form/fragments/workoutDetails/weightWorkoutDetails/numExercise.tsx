import { Slider } from "@react-native-assets/slider";
import { Text, View } from "react-native";
import { globalStyles } from "../../../../../styles/global";
import { formStyles } from "@/styles/form";

export default function NumExercises({ formikProps, setScroll }: any) {
  return (
    <>
      <View style={formStyles.workoutDetailsFormCommon}>
        <View style={formStyles.sliderLabel}>
          <Text style={globalStyles.label}>Number of Exercises:</Text>
          <Text style={{ ...globalStyles.label, left: 5 }}>
            {formikProps.values.numExercises}
          </Text>
        </View>

        <Slider
          style={formStyles.slider}
          minimumValue={3}
          maximumValue={10}
          trackHeight={3}
          step={1}
          thumbSize={16.5}
          minimumTrackTintColor="#FFC4C4"
          maximumTrackTintColor="#D0D0D0"
          thumbTintColor="#FFC4C4"
          onSlidingStart={(value) => setScroll(false)}
          onSlidingComplete={(value) => setScroll(true)}
          onValueChange={(value) =>
            formikProps.setFieldValue("numExercises", value)
          }
        />
      </View>
    </>
  );
}
