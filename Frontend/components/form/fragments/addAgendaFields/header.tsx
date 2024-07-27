import { globalStyles } from "../../../../styles/global";
import { Text, View } from "react-native";
import CustomTextInput from "@/components/general/customTextInput";
import { formStyles } from "@/styles/form";

export default function HeaderField({ formikProps }: any) {
  return (
    <>
      <View style={formStyles.noSliderFormCommon}>
        <Text style={globalStyles.label}>Header:</Text>
        <CustomTextInput
          style={globalStyles.input}
          placeholder="Full body workout"
          onChangeText={formikProps.handleChange("header")}
          value={formikProps.values.header}
          // When we click away, run the validation schema on header field
          onBlur={formikProps.handleBlur("header")}
        />

        {/* 
          If there is an error and field has been visited
          Visited: Click into --> click away 
          Display that error
        */}
        {formikProps.errors.header && formikProps.touched.header && (
          <Text style={formStyles.errorText}>{formikProps.errors.header}</Text>
        )}
      </View>
    </>
  );
}
