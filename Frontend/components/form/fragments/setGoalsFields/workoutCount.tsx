import { globalStyles } from "../../../../styles/global";
import { Text, View } from "react-native";
import CustomTextInput from "@/components/general/customTextInput";
import { formStyles } from "@/styles/form";

export default function WorkoutCountField({ formikProps }: any) {
  return (
    <>
      <View style={formStyles.noSliderFormCommon}>
        <Text style={globalStyles.label}>Workouts:</Text>
        <CustomTextInput
          style={globalStyles.input}
          placeholder="8"
          onChangeText={formikProps.handleChange("workoutCount")}
          value={formikProps.values.workoutCount}
          keyboardType="numeric"
          // When we click away, run the validation schema on workoutCount field
          onBlur={formikProps.handleBlur("workoutCount")}
        />

        {/* 
          If there is an error and field has been visited
          Visited: Click into --> click away 
          Display that error
        */}
        {formikProps.errors.workoutCount &&
          formikProps.touched.workoutCount && (
            <Text style={formStyles.errorText}>
              {formikProps.errors.workoutCount}
            </Text>
          )}
      </View>
    </>
  );
}
