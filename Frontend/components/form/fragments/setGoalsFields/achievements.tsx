import { globalStyles } from "../../../../styles/global";
import { Text, View } from "react-native";
import CustomTextInput from "@/components/general/customTextInput";
import { formStyles } from "@/styles/form";

export default function AchievementsField({ formikProps }: any) {
  return (
    <>
      <View style={formStyles.noSliderFormCommon}>
        <Text style={globalStyles.label}>Achievements:</Text>
        <CustomTextInput
          style={globalStyles.input}
          placeholder="8"
          onChangeText={formikProps.handleChange("achievements")}
          value={formikProps.values.achievements}
          keyboardType="numeric"
          // When we click away, run the validation schema on achievements field
          onBlur={formikProps.handleBlur("achievements")}
        />

        {/* 
          If there is an error and field has been visited
          Visited: Click into --> click away 
          Display that error
        */}
        {formikProps.errors.achievements &&
          formikProps.touched.achievements && (
            <Text style={formStyles.errorText}>
              {formikProps.errors.achievements}
            </Text>
          )}
      </View>
    </>
  );
}
