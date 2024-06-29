import { globalStyles } from "../../../../styles/global";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { formStyles } from "@/styles/form";

export default function GenderField({ formikProps }: any) {
  const [maleButton, setMaleButton] = useState(false);
  const [femaleButton, setFemaleButton] = useState(false);

  const maleButtonHandler = (formikProps: any) => {
    // male button is already active
    if (maleButton) {
      formikProps.setFieldValue("gender", "");
    } else {
      // male button is not yet active
      formikProps.setFieldValue("gender", "M");
    }

    setMaleButton(!maleButton);
    setFemaleButton(false);
  };

  const femaleButtonHandler = (formikProps: any) => {
    // female button is already active
    if (femaleButton) {
      formikProps.setFieldValue("gender", "");
    } else {
      // female button is not yet active
      formikProps.setFieldValue("gender", "F");
    }

    setFemaleButton(!femaleButton);
    setMaleButton(false);
  };

  return (
    <>
      <View style={formStyles.accountDetailsFormCommon}>
        <Text style={globalStyles.label}>Gender:</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            style={[
              styles.genderOption,
              maleButton ? styles.selectedGender : undefined,
            ]}
            onPress={() => maleButtonHandler(formikProps)}
          >
            <Text style={{ fontSize: 12, fontFamily: "inter-regular" }}>
              Male
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.genderOption,
              femaleButton ? styles.selectedGender : undefined,
            ]}
            onPress={() => femaleButtonHandler(formikProps)}
          >
            <Text style={{ fontSize: 12, fontFamily: "inter-regular" }}>
              Female
            </Text>
          </TouchableOpacity>
        </View>
        {formikProps.errors.gender && (
          <Text style={formStyles.errorText}>{formikProps.errors.gender}</Text>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  genderOption: {
    width: "48%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    alignItems: "center",
  },

  selectedGender: {
    borderColor: "red",
  },
});
