import { Text, View } from "react-native";
import { globalStyles } from "../../../../styles/global";
import CustomTextInput from "@/components/general/customTextInput";

export default function HeightField({ formikProps }: any) {
  return (
    <>
      <View style={{ marginBottom: 15 }}>
        <Text style={globalStyles.label}>Height (in metres):</Text>

        <CustomTextInput
          style={globalStyles.input}
          placeholder="1.80"
          onChangeText={formikProps.handleChange("height")}
          value={formikProps.values.height}
          keyboardType="numeric"
        />
      </View>
    </>
  );
}
