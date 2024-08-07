import { globalStyles } from "../../../../styles/global";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useState, useEffect } from "react";
import { formStyles } from "@/styles/form";

export default function GenderField({ formikProps }: any) {
  const [maleButton, setMaleButton] = useState(false);
  const [femaleButton, setFemaleButton] = useState(false);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    // Count >= 1 means that we have interacted with the gender buttons at least once
    // Therefore, it is in a visited state
    // We can force validation with setFieldTouched
    if (count >= 1) {
      formikProps.setFieldTouched("gender", true);
    }
  }, [count]);

  const maleButtonHandler = async (formikProps: any) => {
    // Male button is already active
    // Deactivate it and set its value to the initial (so no validation message shows)
    if (maleButton) {
      await formikProps.setFieldValue("gender", "");
    } else {
      // Male button is not yet active
      // Activate it and set its value to the new value
      await formikProps.setFieldValue("gender", "M");
    }

    setMaleButton(!maleButton);
    setFemaleButton(false);
    setCount((prev) => prev + 1);
  };

  const femaleButtonHandler = async (formikProps: any) => {
    // Female button is already active
    // Deactivate it and set its value to the initial (so no validation message shows)
    if (femaleButton) {
      await formikProps.setFieldValue("gender", "");
    } else {
      // Female button is not yet active
      // Activate it and set its value to the new value
      await formikProps.setFieldValue("gender", "F");
    }

    setFemaleButton(!femaleButton);
    setMaleButton(false);
    setCount((prev) => prev + 1);
  };

  return (
    <>
      <View style={formStyles.noSliderFormCommon}>
        <Text style={globalStyles.label}>Gender:</Text>
        <View style={styles.wrapper}>
          <TouchableOpacity
            style={[
              styles.genderCommon,
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
              styles.genderCommon,
              femaleButton ? styles.selectedGender : undefined,
            ]}
            onPress={() => femaleButtonHandler(formikProps)}
          >
            <Text style={{ fontSize: 12, fontFamily: "inter-regular" }}>
              Female
            </Text>
          </TouchableOpacity>
        </View>

        {/* 
          If there is an error and field has been visited
          Visited: Click into --> click away 
          Display that error
        */}
        {formikProps.errors.gender && formikProps.touched.gender && (
          <Text style={formStyles.errorText}>{formikProps.errors.gender}</Text>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  genderCommon: {
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
