import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { globalStyles } from "../../../../styles/global";
import { useState, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import CustomTextInput from "@/components/general/customTextInput";
import { formStyles } from "@/styles/form";
import StartEndTimesModal from "@/components/modal/homePage/calendarPage/startEndTime";

export default function StartEndTimesField({ formikProps }: any) {
  const [timeModal, setTimeModal] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const selected = useRef<boolean>(false);
  return (
    <>
      <View style={formStyles.noSliderFormCommon}>
        <Text style={globalStyles.label}>Start & End Times:</Text>
        <TouchableOpacity
          style={styles.fieldWrapper}
          onPress={() => setTimeModal(true)}
          // Makes press feedback invisible
          activeOpacity={1}
        >
          <CustomTextInput
            style={
              selected.current
                ? [styles.textInput, styles.selected]
                : [styles.textInput]
            }
            placeholder="0800 - 1000"
            value={value}
            editable={false}
          />
          <Ionicons name="chevron-down-outline" size={20} style={styles.icon} />
        </TouchableOpacity>

        <StartEndTimesModal
          visibility={timeModal}
          setVisibility={setTimeModal}
          selected={selected}
          setValue={setValue}
          formikProps={formikProps}
        />
        {formikProps.errors.startTime &&
          formikProps.touched.startTime &&
          formikProps.errors.endTime &&
          formikProps.touched.endTime && (
            <Text style={formStyles.errorText}>
              Start & end times are required
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
