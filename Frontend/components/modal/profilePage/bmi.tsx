import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

import { globalStyles } from "../../../styles/global";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import GeneralModalTemplate from "../templates/generalModalTemplate";
import SubmitButton from "@/components/general/submit";

export default function BmiModal() {
  const [visibility, setVisibility] = useState<boolean>(false);
  return (
    <>
      <TouchableOpacity onPress={() => setVisibility(true)}>
        <Ionicons name="information-circle-outline" size={18} color="red" />
      </TouchableOpacity>

      <GeneralModalTemplate visibleState={visibility}>
        <Text style={globalStyles.header}>Body Mass Index (BMI)</Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={globalStyles.para}>
            BMI is an estimate of body fat based on height and weight. It can
            help determine whether a person is at an unhealthy or healthy
            weight.
          </Text>

          <SubmitButton
            onPressHandler={() => setVisibility(false)}
            text="Ok"
            style={styles.submitButton}
          />
        </ScrollView>
      </GeneralModalTemplate>
    </>
  );
}

const styles = StyleSheet.create({
  submitButton: {
    alignSelf: "flex-end",
    width: "50%",
    marginTop: "5%",
  },
});
