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
      <View style={formStyles.noSliderFormCommon}>
        <Text style={globalStyles.label}>Password:</Text>
        <View style={styles.wrapper}>
          <CustomTextInput
            style={styles.textInput}
            placeholder="youCantSeeMe69"
            onChangeText={formikProps.handleChange("password")}
            value={formikProps.values.password}
            secureTextEntry={!visible}
            // When we click away, run the validation schema on password field
            onBlur={formikProps.handleBlur("password")}
          />

          {visible && (
            <TouchableOpacity onPress={() => setVisibility(false)}>
              <Ionicons name="eye-off-outline" size={20} style={styles.icon} />
            </TouchableOpacity>
          )}

          {!visible && (
            <TouchableOpacity onPress={() => setVisibility(true)}>
              <Ionicons name="eye-outline" size={20} style={styles.icon} />
            </TouchableOpacity>
          )}
        </View>

        {/* 
          If there is an error and field has been visited
          Visited == True: Click into --> click away 
          Display that error 
        */}
        {formikProps.errors.password && formikProps.touched.password && (
          <Text style={formStyles.errorText}>
            {formikProps.errors.password}
          </Text>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    ...globalStyles.input,
    flexDirection: "row",
    alignItems: "center",
  },

  // Special case, we don't just use globalStyles.input
  // Since we are putting a wrapper around the input field
  textInput: {
    fontFamily: "inter-regular",
    fontSize: 12,
    borderRadius: 6,
    width: "90%",
    height: "100%",
  },

  icon: {
    position: "relative",
    top: 2,
  },
});
