import { Text, View } from "react-native";
import { globalStyles } from "../../../../styles/global";
import CustomTextInput from "@/components/general/customTextInput";
import { formStyles } from "@/styles/form";

export default function WeightField({ formikProps }: any) {
  return (
    <>
      <View style={formStyles.noSliderFormCommon}>
        <Text style={globalStyles.label}>Weight (in kg):</Text>

        <CustomTextInput
          style={globalStyles.input}
          placeholder="69"
          onChangeText={formikProps.handleChange("weight")}
          value={formikProps.values.weight}
          keyboardType="numeric"
          // When we click away, run the validation schema on weight field
          onBlur={formikProps.handleBlur("weight")}
        />

        {/* 
          If there is an error and field has been visited
          Visited == True: Click into --> click away 
          Display that error 
        */}
        {formikProps.errors.weight && formikProps.touched.weight && (
          <Text style={formStyles.errorText}>{formikProps.errors.weight}</Text>
        )}
      </View>
    </>
  );
}
