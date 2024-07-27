import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { globalStyles } from "../../../styles/global";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import SubmitButton from "@/components/general/submit";
import RunWorkoutForm from "@/components/form/full/runWorkout";
import GeneralModalTemplate from "../templates/generalModalTemplate";

export default function RunWorkoutModal({
  setRunWorkoutData,
  setMessage,
  clearAll,
}: any) {
  const [visibility, setVisibility] = useState<boolean>(false);

  return (
    <>
      <SubmitButton
        onPressHandler={() => setVisibility(true)}
        text="Run Regime"
        style={styles.submitButton}
      />

      <GeneralModalTemplate
        visibleState={visibility}
        additionalStyles={styles.paddingAdjustment}
      >
        <View style={styles.headerWrapper}>
          <Text style={styles.modalHeader}>Run Planner:</Text>
          <TouchableOpacity onPress={() => setVisibility(false)}>
            <Ionicons name="close-circle-outline" size={25}></Ionicons>
          </TouchableOpacity>
        </View>

        <RunWorkoutForm
          setRunWorkoutModal={setVisibility}
          setRunWorkoutData={setRunWorkoutData}
          clearAll={clearAll}
          setMessage={setMessage}
        />
      </GeneralModalTemplate>
    </>
  );
}

const styles = StyleSheet.create({
  submitButton: {
    flex: 1,
    marginHorizontal: 5,
  },

  paddingAdjustment: {
    paddingLeft: 6,
  },

  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  modalHeader: {
    ...globalStyles.header,
    position: "relative",
    left: 9,
  },
});
