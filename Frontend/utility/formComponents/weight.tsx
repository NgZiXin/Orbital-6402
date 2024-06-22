import { Text, TextInput, View } from "react-native";
import { globalStyles } from "../../styles/global";

export default function WeightField({ formikProps }: any) {
  return (
    <>
      <View>
        <Text style={[globalStyles.para, globalStyles.label]}>
          Weight (in kg):
        </Text>
        <TextInput
          style={[globalStyles.input, globalStyles.para]}
          placeholder="69"
          onChangeText={formikProps.handleChange("weight")}
          value={formikProps.values.weight}
          keyboardType="numeric"
        />
      </View>
    </>
  );
}
