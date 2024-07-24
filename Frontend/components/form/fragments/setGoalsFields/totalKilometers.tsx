import { globalStyles } from "../../../../styles/global";
import { Text, View } from "react-native";
import CustomTextInput from "@/components/general/customTextInput";
import { formStyles } from "@/styles/form";

export default function TotalKilometersField({ formikProps }: any) {
  return (
    <>
      <View style={formStyles.noSliderFormCommon}>
        <Text style={globalStyles.label}>Total Kilometers:</Text>
        <CustomTextInput
          style={globalStyles.input}
          placeholder="8"
          onChangeText={formikProps.handleChange("totalKilometers")}
          value={formikProps.values.totalKilometers}
          keyboardType="numeric"
          // When we click away, run the validation schema on totalKilometers field
          onBlur={formikProps.handleBlur("totalKilometers")}
        />

        {/* 
          If there is an error and field has been visited
          Visited: Click into --> click away 
          Display that error
        */}
        {formikProps.errors.totalKilometers &&
          formikProps.touched.totalKilometers && (
            <Text style={formStyles.errorText}>
              {formikProps.errors.totalKilometers}
            </Text>
          )}
      </View>
    </>
  );
}
