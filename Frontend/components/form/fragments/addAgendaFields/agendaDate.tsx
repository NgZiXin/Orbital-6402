import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { globalStyles } from "../../../../styles/global";
import { useState, useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomTextInput from "@/components/general/customTextInput";
import { formStyles } from "@/styles/form";

const todayDate: Date = new Date();

export default function AgendaDateField({ formikProps }: any) {
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const selected = useRef<boolean>(false);
  const count = useRef<number>(0);

  useEffect(() => {
    // Count >= 1 means that we have interacted with the agendaDate picker at least once
    // Therefore, it is in a visited state
    // We can force validation with setFieldTouched
    if (count.current >= 1) {
      // Enforce a timeout of 300ms before validation check
      // So that the tester function for agendaDate gets the right agendaDate (wait for external async threads to finish?)
      const timer = setTimeout(() => {
        formikProps.setFieldTouched("agendaDate", true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [count.current]);

  return (
    <>
      <View style={formStyles.noSliderFormCommon}>
        <Text style={globalStyles.label}>Date:</Text>
        {showPicker && (
          <DateTimePicker
            mode="date"
            display="spinner"
            negativeButton={{ label: "Cancel", textColor: "#F5BABA" }}
            positiveButton={{ label: "OK", textColor: "#F5BABA" }}
            value={
              formikProps.values.agendaDate !== undefined
                ? formikProps.values.agendaDate
                : todayDate
            }
            onChange={async (event, selectedDate) => {
              // Here, both selected and count are ref variables instead of the usual state variable
              // Since making them state variables cuz the DTP to be buggy!

              count.current += 1;
              if (event.type === "set") {
                // Closing the picker first before setting the field value
                // Magically resolves the buggy/flashy DTP!!
                setShowPicker(false);
                selected.current = true;
                await formikProps.setFieldValue("agendaDate", selectedDate);
              } else {
                setShowPicker(false);
                await formikProps.setFieldValue("agendaDate", undefined);
              }
            }}
          />
        )}

        <TouchableOpacity
          style={styles.fieldWrapper}
          onPress={() => setShowPicker(true)}
          // Makes press feedback invisible
          activeOpacity={1}
        >
          <CustomTextInput
            style={
              selected.current
                ? [styles.selected, styles.textInput]
                : [styles.textInput]
            }
            placeholder={todayDate.toLocaleDateString()}
            value={
              formikProps.values.agendaDate !== undefined
                ? formikProps.values.agendaDate.toLocaleDateString()
                : todayDate.toLocaleDateString()
            }
            onBlur={formikProps.handleBlur("agendaDate")}
            editable={false}
          />
          <Ionicons name="chevron-down-outline" size={20} style={styles.icon} />
        </TouchableOpacity>

        {/* 
          If there is an error and field has been visited
          Visited: Click into --> click away 
          Display that error
        */}

        {formikProps.errors.agendaDate && formikProps.touched.agendaDate && (
          <Text style={formStyles.errorText}>
            {formikProps.errors.agendaDate}
          </Text>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  fieldWrapper: {
    ...globalStyles.input,
    flexDirection: "row",
    alignItems: "center",
  },

  textInput: {
    fontFamily: "inter-regular",
    fontSize: 12,
    borderRadius: 6,
    width: "90%",
  },

  selected: {
    color: "black",
  },

  icon: {
    color: "grey",
  },
});
