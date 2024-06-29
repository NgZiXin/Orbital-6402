import { globalStyles } from "../../../../styles/global";
import { Text, View } from "react-native";
import CustomTextInput from "@/components/general/customTextInput";
import { formStyles } from "@/styles/form";

export default function UsernameField({ formikProps }: any) {
  return (
    <>
      <View style={formStyles.accountDetailsFormCommon}>
        <Text style={globalStyles.label}>Name:</Text>
        <CustomTextInput
          style={globalStyles.input}
          placeholder="John Cena"
          onChangeText={formikProps.handleChange("username")}
          value={formikProps.values.username}
        />
      </View>
    </>
  );
}
