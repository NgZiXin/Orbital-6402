import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { globalStyles } from "../../../styles/global";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import SubmitButton from "@/components/general/submit";
import WeightWorkoutForm from "@/components/form/full/weightWorkout";
import GeneralModalTemplate from "../templates/generalModalTemplate";

export default function WeightWorkoutModal({
  setWeightWorkoutData,
  setMessage,
  clearAll,
}: any) {
  const [visibility, setVisibility] = useState<boolean>(false);

  return (
    <>
      <SubmitButton
        onPressHandler={() => setVisibility(true)}
        text="Weight Workout"
        style={styles.submitButton}
      />

      <GeneralModalTemplate
        visibleState={visibility}
        additionalStyles={styles.paddingAdjustment}
      >
        <View>
          <View style={styles.headerWrapper}>
            <Text style={styles.modalHeader}>Gym Planner</Text>
            <TouchableOpacity onPress={() => setVisibility(false)}>
              <Ionicons name="close-circle-outline" size={25}></Ionicons>
            </TouchableOpacity>
          </View>

          <WeightWorkoutForm
            setWeightWorkoutModal={setVisibility}
            setWeightWorkoutData={setWeightWorkoutData}
            setMessage={setMessage}
            clearAll={clearAll}
          />
        </View>
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
