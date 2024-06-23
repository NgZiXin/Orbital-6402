import { Text, View } from "react-native";
import { globalStyles } from "../../../../styles/global";
import CustomTextInput from "@/components/general/customTextInput";

export default function HealthConditions({ formikProps }: any) {
  return (
    <>
      <View style={{ marginBottom: 12 }}>
        <Text style={globalStyles.label}>Health Conditions (if any):</Text>
        <CustomTextInput
          multiline={true}
          numberOfLines={5}
          style={{
            ...globalStyles.input,
            textAlignVertical: "top",
          }}
          placeholder="List out your health conditions here"
          onChangeText={formikProps.handleChange("healthCond")}
          value={formikProps.values.healthCond}
        />
      </View>
    </>
  );
}
