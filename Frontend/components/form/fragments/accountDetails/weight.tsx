import { Text, View } from "react-native";
import { globalStyles } from "../../../../styles/global";
import CustomTextInput from "@/components/general/customTextInput";

export default function WeightField({ formikProps }: any) {
  return (
    <>
      <View style={{ marginBottom: 15 }}>
        <Text style={globalStyles.label}>Weight (in kg):</Text>
        <CustomTextInput
          style={globalStyles.input}
          placeholder="69"
          onChangeText={formikProps.handleChange("weight")}
          value={formikProps.values.weight}
          keyboardType="numeric"
        />
      </View>
    </>
  );
}
