import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

import { globalStyles } from "../../../styles/global";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import GeneralModalTemplate from "../templates/generalModalTemplate";
import SubmitButton from "@/components/general/submit";

export default function AboutModal() {
  const [visibility, setVisibility] = useState<boolean>(false);
  return (
    <>
      <TouchableOpacity onPress={() => setVisibility(true)}>
        <Ionicons name="help-circle-outline" size={26} style={styles.icon} />
      </TouchableOpacity>

      <GeneralModalTemplate visibleState={visibility}>
        <Text style={globalStyles.header}>About Us</Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={globalStyles.para}>
            🧙 Workout Wizards 🧙 is a fitness app that complements the popular
            Strava fitness app.
          </Text>
          <Text style={globalStyles.para}>
            Our aim is to help local Singaporean users along in their fitness
            journey.
          </Text>
          <Text style={globalStyles.para}>
            Check out the many cool features that we have!
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
  icon: {
    paddingTop: 2,
  },

  submitButton: {
    alignSelf: "flex-end",
    width: "50%",
    marginTop: "5%",
  },
});
