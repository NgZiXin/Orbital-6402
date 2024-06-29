import { Text, View } from "react-native";
import { globalStyles } from "../../../../styles/global";
import CustomTextInput from "@/components/general/customTextInput";
import { formStyles } from "@/styles/form";

export default function OtherRemarks({ formikProps }: any) {
  return (
    <>
      <View style={{ ...formStyles.workoutDetailsFormCommon, width: "95%" }}>
        <Text style={globalStyles.label}>Other Remarks (if any):</Text>

        <CustomTextInput
          multiline={true}
          numberOfLines={5}
          style={{
            ...globalStyles.input,
            textAlignVertical: "top",
          }}
          placeholder="Any other remarks here"
          onChangeText={formikProps.handleChange("otherRemarks")}
          value={formikProps.values.otherRemarks}
        />
      </View>
    </>
  );
}
