import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { globalStyles } from "../../../styles/global";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import GeneralModalTemplate from "../templates/generalModalTemplate";
import SubmitButton from "@/components/general/submit";
import SetGoalsForm from "@/components/form/full/setGoals";

interface SetGoalsModalProps {
  setWeekGoalValues: (value: number[]) => void;
  setUpdate: (value: boolean | ((prev: boolean) => boolean)) => void;
}

export default function SetGoalsModal({
  setWeekGoalValues,
  setUpdate,
}: SetGoalsModalProps) {
  const [visibility, setVisibility] = useState<boolean>(false);
  return (
    <>
      <SubmitButton
        onPressHandler={() => setVisibility(true)}
        text="Set Goals"
        icon={["checkmark-done-outline", 25, styles.buttonIcon]}
        style={styles.submitButton}
      />

      <GeneralModalTemplate visibleState={visibility}>
        <View style={styles.headerWrapper}>
          <Text style={globalStyles.header}>Set Weekly Goals:</Text>
          <TouchableOpacity onPress={() => setVisibility(false)}>
            <Ionicons name="close-circle-outline" size={25}></Ionicons>
          </TouchableOpacity>
        </View>

        <SetGoalsForm
          setWeekGoalValues={setWeekGoalValues}
          setGoalsModal={setVisibility}
          setUpdate={setUpdate}
        />
      </GeneralModalTemplate>
    </>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  submitButton: {
    width: "43%",
    backgroundColor: "#F6F2F2",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },

  buttonIcon: {
    position: "relative",
    left: 4,
  },
});
