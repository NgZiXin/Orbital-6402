import { globalStyles } from "../../../../styles/global";
import { StyleSheet, Text, View } from "react-native";
import CustomTextInput from "@/components/general/customTextInput";
import { formStyles } from "@/styles/form";

export default function LocationField({ formikProps }: any) {
  return (
    <>
      <View style={styles.fieldWrapper}>
        <Text style={globalStyles.label}>Location:</Text>
        <CustomTextInput
          style={globalStyles.input}
          placeholder="Postal Code"
          onChangeText={formikProps.handleChange("location")}
          value={formikProps.values.location}
          keyboardType="numeric"
          // When we click away, run the validation schema on location field
          onBlur={formikProps.handleBlur("location")}
        />

        {/* 
          If there is an error and field has been visited
          Visited: Click into --> click away 
          Display that error
        */}
        {formikProps.errors.location && formikProps.touched.location && (
          <Text style={formStyles.errorText}>
            {formikProps.errors.location}
          </Text>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  fieldWrapper: {
    ...formStyles.sliderFormCommon,
    width: "95%",
  },
});
