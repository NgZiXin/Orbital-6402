import { globalStyles } from "../../../../styles/global";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import CustomTextInput from "@/components/general/customTextInput";
import { formStyles } from "@/styles/form";

export default function PasswordField({ formikProps }: any) {
  const [visible, setVisibility] = useState(false);

  return (
    <>
      <View style={formStyles.accountDetailsFormCommon}>
        <Text style={globalStyles.label}>Password:</Text>
        <View style={[globalStyles.input, styles.extra]}>
          <CustomTextInput
            style={{
              fontFamily: "inter-regular",
              fontSize: 12,
              borderRadius: 6,
              width: "90%",
              height: "100%",
            }}
            placeholder="youCantSeeMe69"
            onChangeText={formikProps.handleChange("password")}
            value={formikProps.values.password}
            secureTextEntry={!visible}
          />

          {visible && (
            <TouchableOpacity onPress={() => setVisibility(false)}>
              <Ionicons
                name="eye-off-outline"
                size={20}
                style={{
                  position: "relative",
                  top: 2,
                }}
              />
            </TouchableOpacity>
          )}

          {!visible && (
            <TouchableOpacity onPress={() => setVisibility(true)}>
              <Ionicons
                name="eye-outline"
                size={20}
                style={{
                  position: "relative",
                  top: 2,
                }}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  extra: {
    flexDirection: "row",
    alignItems: "center",
  },
});
