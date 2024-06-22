import { Pressable, Text, TextInput, View } from "react-native";
import { globalStyles } from "../../styles/global";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function BirthdayField({ formikProps }: any) {
  const datePlaceholder = new Date();
  const [showPicker, setShowPicker] = useState(false);

  return (
    <>
      <View>
        <Text style={[globalStyles.para, globalStyles.label]}>Birthday:</Text>
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
              formikProps.setFieldValue("birthday", selectedDate || new Date());
            }}
            maximumDate={new Date()}
          />
        )}

        {!showPicker && (
          <Pressable onPress={() => setShowPicker(true)}>
            <TextInput
              style={[globalStyles.input, globalStyles.para]}
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
