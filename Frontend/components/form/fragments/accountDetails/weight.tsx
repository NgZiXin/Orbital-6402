import { Text, View } from "react-native";
import { globalStyles } from "../../../../styles/global";
import CustomTextInput from "@/components/general/customTextInput";
import { formStyles } from "@/styles/form";

export default function WeightField({ formikProps }: any) {
  return (
    <>
      <View style={formStyles.accountDetailsFormCommon}>
        <Text style={globalStyles.label}>Weight (in kg):</Text>
        <CustomTextInput
          style={globalStyles.input}
          placeholder="69"
          onChangeText={formikProps.handleChange("weight")}
          value={formikProps.values.weight}
          keyboardType="numeric"
        />
        {formikProps.errors.weight && (
          <Text style={formStyles.errorText}>{formikProps.errors.weight}</Text>
        )}
      </View>
    </>
  );
}
