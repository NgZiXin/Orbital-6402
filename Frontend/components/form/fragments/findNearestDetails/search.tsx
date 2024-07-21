import { globalStyles } from "../../../../styles/global";
import { Text, View } from "react-native";
import CustomTextInput from "@/components/general/customTextInput";
import { formStyles } from "@/styles/form";

export default function SearchField({ formikProps }: any) {
  return (
    <>
      <View style={formStyles.findNearestDetailsFormCommon}>
        <Text style={globalStyles.label}>Location:</Text>
        <CustomTextInput
          style={globalStyles.input}
          placeholder="Address / Postal Code"
          onChangeText={formikProps.handleChange("search")}
          value={formikProps.values.search}
        />
        {formikProps.errors.search && (
          <Text style={formStyles.errorText}>
            {formikProps.errors.search}
          </Text>
        )}
      </View>
    </>
  );
}
