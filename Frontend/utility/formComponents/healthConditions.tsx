import { StyleSheet, Text, TextInput, View } from "react-native";
import { globalStyles } from "../../styles/global";

export default function HealthConditions({ formikProps }: any) {
  return (
    <>
      <View>
        <Text style={[globalStyles.para, globalStyles.label]}>
          Health Conditions (if any):
        </Text>
        <TextInput
          multiline={true}
          numberOfLines={5}
          style={{
            ...globalStyles.para,
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
