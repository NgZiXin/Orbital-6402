import { Pressable, StyleSheet, Text, View } from "react-native";
import { globalStyles } from "../../../../styles/global";
import { useState, useEffect, useRef } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomTextInput from "@/components/general/customTextInput";
import { formStyles } from "@/styles/form";

const todayDate: Date = new Date();

export default function BirthdayField({ formikProps }: any) {
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const selected = useRef<boolean>(false);
  const count = useRef<number>(0);

  useEffect(() => {
    // Count >= 1 means that we have interacted with the birthday picker at least once
    // Therefore, it is in a visited state
    // We can force validation with setFieldTouched
    if (count.current >= 1) {
      // Enforce a timeout of 300ms before validation check
      // So that the tester function for birthday gets the right birthday (wait for external async threads to finish?)
      const timer = setTimeout(() => {
        formikProps.setFieldTouched("birthday", true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [count.current]);

  return (
    <>
      <View style={formStyles.noSliderFormCommon}>
        <Text style={globalStyles.label}>Birthday:</Text>
        {showPicker && (
          <DateTimePicker
            mode="date"
            display="spinner"
            negativeButton={{ label: "Cancel", textColor: "#F5BABA" }}
            positiveButton={{ label: "OK", textColor: "#F5BABA" }}
            value={formikProps.values.birthday}
            onChange={async (event, selectedDate) => {
              // Here, both selected and count are ref variables instead of the usual state variable
              // Since making them state variables cuz the DTP to be buggy!
              if (event.type === "set") {
                selected.current = true;
              }

              // Closing the picker first before setting the field value
              // Magically resolves the buggy/flashy DTP!!
              count.current += 1;
              setShowPicker(false);
              await formikProps.setFieldValue(
                "birthday",
                selectedDate || todayDate
              );
            }}
            maximumDate={todayDate}
          />
        )}

        <Pressable onPress={() => setShowPicker(true)}>
          <CustomTextInput
            style={selected.current ? styles.selected : globalStyles.input}
            placeholder={todayDate.toDateString()}
            onChangeText={formikProps.handleChange("birthday")}
            value={formikProps.values.birthday.toLocaleDateString()}
            editable={false}
          />
        </Pressable>

        {/* 
          If there is an error and field has been visited
          Visited: Click into --> click away 
          Display that error
        */}
        {formikProps.errors.birthday && count.current >= 1 && (
          <Text style={formStyles.errorText}>
            {formikProps.errors.birthday}
          </Text>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  selected: {
    ...globalStyles.input,
    color: "black",
  },
});
