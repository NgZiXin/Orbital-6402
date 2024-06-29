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
        />
        {formikProps.errors.height && (
          <Text style={formStyles.errorText}>{formikProps.errors.height}</Text>
        )}
      </View>
    </>
  );
}
