import { globalStyles } from "../../../../styles/global";
import { Text, View } from "react-native";
import CustomTextInput from "@/components/general/customTextInput";
import { formStyles } from "@/styles/form";

export default function TotalHoursField({ formikProps }: any) {
  return (
    <>
      <View style={formStyles.noSliderFormCommon}>
        <Text style={globalStyles.label}>Total Hours:</Text>
        <CustomTextInput
          style={globalStyles.input}
          placeholder="8"
          onChangeText={formikProps.handleChange("totalHours")}
          value={formikProps.values.totalHours}
          keyboardType="numeric"
          // When we click away, run the validation schema on totalHours field
          onBlur={formikProps.handleBlur("totalHours")}
        />

        {/* 
          If there is an error and field has been visited
          Visited: Click into --> click away 
          Display that error
        */}
        {formikProps.errors.totalHours && formikProps.touched.totalHours && (
          <Text style={formStyles.errorText}>
            {formikProps.errors.totalHours}
          </Text>
        )}
      </View>
    </>
  );
}
