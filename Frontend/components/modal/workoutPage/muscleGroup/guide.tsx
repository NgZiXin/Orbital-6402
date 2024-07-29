import { ScrollView, StyleSheet, Text } from "react-native";

import { globalStyles } from "../../../../styles/global";
import { useState } from "react";
import SubmitButton from "@/components/general/submit";
import GeneralModalTemplate from "../../templates/generalModalTemplate";

export default function GuideModal({ visibility, setVisibility }: any) {
  return (
    // Can consider a blur effect for the background actually
    // When opening this doubly nested modal (ie: layer = 3)
    <>
      <GeneralModalTemplate
        visibleState={visibility}
        additionalStyles={styles.background}
        forWrapper={true}
      >
        <Text style={globalStyles.header}>Workout Creation</Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={globalStyles.para}>
            1. Number of main muscle groups selected must not exceed number of
            exercises.
          </Text>
          <Text style={globalStyles.para}>
            2. You must select a main muscle group first before selecting a sub
            muscle group.
          </Text>
          <Text style={globalStyles.para}>
            3. Selecting a sub muscle group means that you want exercises that
            emphasizes on those areas.
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
  background: {
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },

  submitButton: {
    alignSelf: "flex-end",
    width: "50%",
    marginTop: "5%",
  },
});
