import { Text, View } from "react-native";
import { globalStyles } from "../../../../styles/global";
import CustomTextInput from "@/components/general/customTextInput";
import { formStyles } from "@/styles/form";

export default function HeightField({ formikProps }: any) {
  return (
    <>
      <View style={formStyles.accountDetailsFormCommon}>
        <Text style={globalStyles.label}>Height (in metres):</Text>

        <CustomTextInput
          style={globalStyles.input}
          placeholder="1.80"
          onChangeText={formikProps.handleChange("height")}
          value={formikProps.values.height}
          keyboardType="numeric"
          // When we click away, run the validation schema on height field
          onBlur={formikProps.handleBlur("height")}
        />

        {/*
          If there is an error and field has been visited
          Visited == True: Click into --> click away
          Display that error
        */}
        {formikProps.errors.height && formikProps.touched.height && (
          <Text style={formStyles.errorText}>{formikProps.errors.height}</Text>
        )}
      </View>
    </>
  );
}
