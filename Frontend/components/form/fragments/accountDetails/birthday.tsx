import { Pressable, StyleSheet, Text, View } from "react-native";
import { globalStyles } from "../../../../styles/global";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomTextInput from "@/components/general/customTextInput";
import { formStyles } from "@/styles/form";

const todayDate: Date = new Date();

export default function BirthdayField({ formikProps }: any) {
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [selected, setSelected] = useState<boolean>(false);

  return (
    <>
      <View style={formStyles.accountDetailsFormCommon}>
        <Text style={globalStyles.label}>Birthday:</Text>
        {showPicker && (
          <DateTimePicker
            mode="date"
            display="spinner"
            negativeButton={{ label: "Cancel", textColor: "#F5BABA" }}
            positiveButton={{ label: "OK", textColor: "#F5BABA" }}
            value={formikProps.values.birthday}
            onChange={(event, selectedDate) => {
              // closing the picker first before setting the field value
              // magically resolves the buggy/flashy DTP!!
              setShowPicker(false);
              setSelected(true);
              formikProps.setFieldValue("birthday", selectedDate || todayDate);
            }}
            maximumDate={todayDate}
          />
        )}

        <Pressable onPress={() => setShowPicker(true)}>
          <CustomTextInput
            style={selected ? styles.selected : globalStyles.input}
            placeholder={todayDate.toDateString()}
            onChangeText={formikProps.handleChange("birthday")}
            value={formikProps.values.birthday.toLocaleDateString()}
            editable={false}
            onPressIn={() => setShowPicker(true)}
          />
        </Pressable>

        {formikProps.errors.birthday && (
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
