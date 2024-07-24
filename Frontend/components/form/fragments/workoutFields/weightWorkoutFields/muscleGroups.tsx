import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MuscleGroupModal from "@/components/modal/workoutPage/muscleGroup/muscleGroup";
import { globalStyles } from "@/styles/global";
import { formStyles } from "@/styles/form";

export default function MuscleGroups({ formikProps, workoutModalHeight }: any) {
  const [selectButton, setSelectButton] = useState(false);
  const [nilButton, setNilButton] = useState(false);

  const [muscleGroupModal, setMuscleGroupModal] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const selectButtonHandler = () => {
    if (selectButton == false) {
      setMuscleGroupModal(true);
    }

    setSelectButton(!selectButton);
    setNilButton(false);
  };

  const nilButtonHandler = () => {
    formikProps.setFieldValue("muscleGroups", []);
    setNilButton(!nilButton);
    setSelectButton(false);
  };

  return (
    <>
      <View style={{ ...formStyles.sliderFormCommon, width: "95%" }}>
        <Text style={globalStyles.label}>Target Muscle Groups: </Text>
        <View style={styles.wrapper}>
          <TouchableOpacity
            style={[styles.option, selectButton ? styles.selected : undefined]}
            onPress={selectButtonHandler}
          >
            <Text style={globalStyles.label}>Select</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, nilButton ? styles.selected : undefined]}
            onPress={nilButtonHandler}
          >
            <Text style={globalStyles.label}>N.A</Text>
          </TouchableOpacity>
        </View>

        {muscleGroupModal == true && (
          <MuscleGroupModal
            setMuscleGroupModal={setMuscleGroupModal}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            workoutModalHeight={workoutModalHeight}
            formikProps={formikProps}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  option: {
    width: "48%",
    padding: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    alignItems: "center",
  },

  selected: {
    borderColor: "red",
  },
});
