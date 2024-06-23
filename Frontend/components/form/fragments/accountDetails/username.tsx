import { globalStyles } from "../../../../styles/global";
import { Text, View } from "react-native";
import CustomTextInput from "@/components/general/customTextInput";

export default function UsernameField({ formikProps }: any) {
  return (
    <>
      <View style={{ marginBottom: 15 }}>
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
