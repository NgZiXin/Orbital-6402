import { globalStyles } from "../../../../styles/global";
import { StyleSheet, Text, View } from "react-native";
import CustomTextInput from "@/components/general/customTextInput";
import { formStyles } from "@/styles/form";

export default function BodyField({ formikProps }: any) {
  return (
    <>
      <View style={formStyles.noSliderFormCommon}>
        <Text style={globalStyles.label}>Body:</Text>
        <CustomTextInput
          style={{
            ...globalStyles.input,
            textAlignVertical: "top",
          }}
          placeholder="Compound exercises first, then isolation exercises."
          onChangeText={formikProps.handleChange("body")}
          value={formikProps.values.body}
          multiline={true}
          numberOfLines={6}
          // When we click away, run the validation schema on body field
          onBlur={formikProps.handleBlur("body")}
        />

        {/* 
          If there is an error and field has been visited
          Visited: Click into --> click away 
          Display that error
        */}
        {formikProps.errors.body && formikProps.touched.body && (
          <Text style={formStyles.errorText}>{formikProps.errors.body}</Text>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  textInput: {
    ...globalStyles.input,
    textAlignVertical: "top",
  },
});
