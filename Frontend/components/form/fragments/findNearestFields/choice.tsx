import { globalStyles } from "../../../../styles/global";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useState, useEffect } from "react";
import { formStyles } from "@/styles/form";

export default function ChoiceField({ formikProps }: any) {
  const [gymButton, setGymButton] = useState<boolean>(false);
  const [parkButton, setParkButton] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    // Count >= 1 means that we have interacted with the choice buttons at least once
    // Therefore, it is in a visited state
    // We can force validation with setFieldTouched
    if (count >= 1) {
      formikProps.setFieldTouched("choice", true);
    }
  }, [count]);

  const gymButtonHandler = async (formikProps: any) => {
    // Gym button is already active
    // Deactivate it and set its value to the initial (so no validation message shows)
    if (gymButton) {
      await formikProps.setFieldValue("choice", "");
    } else {
      // Gym button is not yet active
      // Activate it and set its value to the new value
      await formikProps.setFieldValue("choice", "gym");
    }

    setGymButton(!gymButton);
    setParkButton(false);
    setCount((prev) => prev + 1);
  };

  const parkButtonHandler = async (formikProps: any) => {
    // Park button is already active
    // Deactivate it and set its value to the initial (so no validation message shows)
    if (parkButton) {
      await formikProps.setFieldValue("choice", "");
    } else {
      // Park button is not yet active
      // Activate it and set its value to the new value
      await formikProps.setFieldValue("choice", "park");
    }

    setParkButton(!parkButton);
    setGymButton(false);
    setCount((prev) => prev + 1);
  };

  return (
    <>
      <View style={styles.fieldWrapper}>
        <Text style={globalStyles.label}>Choice:</Text>
        <View style={styles.buttonsWrapper}>
          <TouchableOpacity
            style={[
              styles.buttonCommon,
              gymButton ? styles.selectedButton : undefined,
            ]}
            onPress={() => gymButtonHandler(formikProps)}
          >
            <Text style={{ fontSize: 12, fontFamily: "inter-regular" }}>
              Gym
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.buttonCommon,
              parkButton ? styles.selectedButton : undefined,
            ]}
            onPress={() => parkButtonHandler(formikProps)}
          >
            <Text style={{ fontSize: 12, fontFamily: "inter-regular" }}>
              Park
            </Text>
          </TouchableOpacity>
        </View>

        {/* 
          If there is an error and field has been visited
          Visited: Click into --> click away 
          Display that error
        */}
        {formikProps.errors.choice && formikProps.touched.choice && (
          <Text style={formStyles.errorText}>{formikProps.errors.choice}</Text>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  fieldWrapper: {
    ...formStyles.sliderFormCommon,
    width: "95%",
  },

  buttonsWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  buttonCommon: {
    width: "48%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    alignItems: "center",
  },

  selectedButton: {
    borderColor: "red",
  },
});
