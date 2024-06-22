import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { globalStyles } from "../../styles/global";

export default function OtherRemarks({ formikProps }: any) {
  return (
    <>
      <View>
        <Text style={[globalStyles.para, globalStyles.label]}>
          Other Remarks (if any):
        </Text>

        <TextInput
          multiline={true}
          numberOfLines={5}
          style={{
            ...globalStyles.para,
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
