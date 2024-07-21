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
  const [modalHeight, setModalHeight] = useState<number>(0);

  const handleLayout = (event: any) => {
    event.persist(); // Persist the event
    const { height } = event.nativeEvent.layout;
    // Add 30 since padding top == 15 and padding bottom == 15
    // For the modalContent element
    setModalHeight(height + 30);
  };

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
        <View onLayout={handleLayout}>
          <View style={styles.headerWrapper}>
            <Text style={styles.modalHeader}>Gym Planner:</Text>
            <TouchableOpacity onPress={() => setVisibility(false)}>
              <Ionicons name="close-circle-outline" size={25}></Ionicons>
            </TouchableOpacity>
          </View>

          <WeightWorkoutForm
            setWeightWorkoutModal={setVisibility}
            setWeightWorkoutData={setWeightWorkoutData}
            setMessage={setMessage}
            clearAll={clearAll}
            weightWorkoutModalHeight={modalHeight}
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
