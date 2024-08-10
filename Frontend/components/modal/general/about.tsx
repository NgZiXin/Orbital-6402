import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { globalStyles } from "../../../styles/global";
import { useState } from "react";
import GeneralModalTemplate from "../templates/generalModalTemplate";
import SubmitButton from "@/components/general/submit";

export default function AboutModal() {
  const [visibility, setVisibility] = useState<boolean>(false);
  return (
    <>
      <TouchableOpacity onPress={() => setVisibility(true)}>
        <Text style={styles.headerText}>Workout Wizards!</Text>
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
  headerText: {
    fontFamily: "inter-bold",
    fontWeight: "bold",
    fontSize: 17,
    color: "#333",
    letterSpacing: 1,
  },

  submitButton: {
    alignSelf: "flex-end",
    width: "50%",
    marginTop: "5%",
  },
});
