import { Pressable, Text, TextInput, View } from "react-native";
import { globalStyles } from "../../styles/global";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function BirthdayField({ formikProps }: any) {
  const datePlaceholder = new Date();
  const [showPicker, setShowPicker] = useState(false);

  return (
    <>
      {/* TODO: Find a way to remove the flashing when click OK on DTP popup */}
      <View>
        <Text style={[globalStyles.para, globalStyles.label]}>Birthday:</Text>
        {showPicker && (
          <DateTimePicker
            mode="date"
            display="spinner"
            value={formikProps.values.birthday}
            onChange={({ type }, selectedDate) => {
              if (type == "set") {
                // set event
                formikProps.setFieldValue(
                  "birthday",
                  selectedDate || formikProps.values.birthday
                );
                setShowPicker(false);
              } else {
                // dismiss event
                setShowPicker(false);
              }
            }}
            maximumDate={new Date("2025-1-1")}
          />
        )}

        {!showPicker && (
          <Pressable onPress={() => setShowPicker(true)}>
            <TextInput
              style={globalStyles.input}
              placeholder={datePlaceholder.toDateString()}
              onChangeText={formikProps.handleChange("birthday")}
              value={formikProps.values.birthday.toLocaleDateString()}
              editable={false}
              onPressIn={() => setShowPicker(true)}
            />
          </Pressable>
        )}
      </View>
    </>
  );
}
