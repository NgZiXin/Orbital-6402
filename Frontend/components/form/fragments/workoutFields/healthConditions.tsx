import { Text, View } from "react-native";
import { globalStyles } from "../../../../styles/global";
import CustomTextInput from "@/components/general/customTextInput";
import { formStyles } from "@/styles/form";

export default function HealthConditions({ formikProps }: any) {
  return (
    <>
      <View style={{ ...formStyles.sliderFormCommon, width: "95%" }}>
        <Text style={globalStyles.label}>Health Conditions (if any):</Text>
        <CustomTextInput
          multiline={true}
          numberOfLines={5}
          style={{
            ...globalStyles.input,
            textAlignVertical: "top",
          }}
          placeholder="List out your health conditions here"
          onChangeText={formikProps.handleChange("healthConds")}
          value={formikProps.values.healthCond}
        />
      </View>
    </>
  );
}
