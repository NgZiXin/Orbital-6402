import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useState, useRef } from "react";
import { modalStyles } from "../../../../styles/modal";
import { globalStyles } from "../../../../styles/global";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons as Icon } from "@expo/vector-icons";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import muscleGroupsList from "./helper/list";
import MultiSelectHeader from "./helper/header";
import MultiSelectFooter from "./helper/footer";
import GuideModal from "./guide";
import MuscleGroupValidationModal from "./muscleGroupValidation";
import SubmitButton from "@/components/general/submit";
import CustomChips from "./helper/customChips";

export default function MuscleGroupModal({
  setMuscleGroupModal,
  selectedItems,
  setSelectedItems,
  formikProps,
}: any) {
  const [validationModal, setValidationModal] = useState<boolean>(false);
  const [guideModal, setGuideModal] = useState<boolean>(false);
  const validationMessage = useRef("");

  function renderSelectText() {
    return "Select Muscle Groups";
  }

  function selectValidation(newItems: string[]) {
    const filterFunction = (item: string) => {
      if (item.length == 1) {
        return true;
      }

      // Else, its a child entry
      // Try to find a parent entry
      const parentItem = newItems.find((element: string) => {
        return element.length === 1 && element.charAt(0) === item.charAt(0);
      });
      if (parentItem) {
        return true;
      } else {
        return false;
      }
    };

    const newList = newItems.filter(filterFunction);
    setSelectedItems(newList);
  }

  // Count of main muscle groups
  function getCount() {
    const temp = selectedItems.filter((item: string) => {
      return item.length == 1;
    });

    return temp.length;
  }

  function handleSubmit() {
    const numMain = getCount();
    if (numMain < 1) {
      validationMessage.current = "Must select at least one main muscle group!";
      setValidationModal(true);
    } else if (numMain > formikProps.values.numExercises) {
      validationMessage.current =
        "Number of main muscle groups cannot exceed total number of workouts!";
      setValidationModal(true);
    } else {
      formikProps.setFieldValue("muscleGroups", selectedItems);
      setMuscleGroupModal(false);
    }
  }

  const handlePressInfo = () => {
    setGuideModal(true);
  };

  return (
    <>
      <Modal animationType="fade" visible={true} transparent={true}>
        <View style={modalStyles.modalWrapper}>
          <View style={modalStyles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={globalStyles.header}>Plan Your Workout</Text>

                <TouchableOpacity onPress={() => setMuscleGroupModal(false)}>
                  <Ionicons name="close-circle-outline" size={25}></Ionicons>
                </TouchableOpacity>
              </View>

              <Text
                style={{
                  ...globalStyles.para,
                  position: "relative",
                  bottom: 5,
                }}
              >
                Click on the button below to start planning.
                <TouchableOpacity onPress={handlePressInfo}>
                  <Ionicons
                    name="information-circle-outline"
                    size={18}
                    color="red"
                  />
                </TouchableOpacity>
              </Text>

              <View style={{ marginTop: 7 }}>
                {/* @ts-ignore */}
                <SectionedMultiSelect
                  items={muscleGroupsList}
                  IconRenderer={Icon}
                  uniqueKey="id"
                  subKey="children"
                  modalAnimationType="fade"
                  showDropDowns={true}
                  hideSearch={true}
                  headerComponent={<MultiSelectHeader />}
                  stickyFooterComponent={
                    <MultiSelectFooter getCount={getCount} />
                  }
                  selectedIconComponent={CustomTickIcon}
                  selectedItems={selectedItems}
                  onSelectedItemsChange={selectValidation}
                  renderSelectText={renderSelectText}
                  customChipsRenderer={({
                    selectedItems,
                  }: {
                    selectedItems: string[];
                  }) => {
                    return <CustomChips selectedItems={selectedItems} />;
                  }}
                  parentChipsRemoveChildren={true}
                  showsVerticalScrollIndicator={false}
                  colors={styles.colors}
                  styles={{
                    backdrop: styles.backdrop,
                    selectToggle: styles.box,
                    selectToggleText: styles.boxText,
                    chipContainer: styles.chipContainer,
                    chipText: styles.chipText,
                    item: { marginVertical: 5 },
                    itemText: {
                      fontWeight: "normal",
                      fontFamily: "inter-semibold",
                      fontSize: 16,
                    },
                    subItemText: {
                      fontWeight: "normal",
                      fontFamily: "inter-regular",
                      fontSize: 12,
                    },
                    confirmText: {
                      fontWeight: "normal",
                      fontFamily: "inter-regular",
                      fontSize: 16,
                    },
                  }}
                />
              </View>
              <GuideModal
                visibility={guideModal}
                setVisibility={setGuideModal}
              />
              <MuscleGroupValidationModal
                visibility={validationModal}
                setVisibility={setValidationModal}
                topText="Workout Validation"
                bottomText={validationMessage.current}
              />
              <SubmitButton
                style={{ marginTop: 25 }}
                onPressHandler={handleSubmit}
                text="Submit Workout"
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

function CustomTickIcon() {
  return (
    <Icon
      name="check"
      size={15}
      style={{
        color: "#87CEB6",
        position: "relative",
        right: 12.5,
      }}
    />
  );
}

const styles = StyleSheet.create({
  colors: {
    // @ts-ignore
    primary: "#CE879F",
  },

  backdrop: {
    backgroundColor: "rgba(211, 211, 211, 0.2)",
  },

  box: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#bbb",
    padding: 12,
    marginBottom: 12,
  },

  boxText: {
    fontFamily: "inter-regular",
    fontSize: 12.5,
  },

  chipContainer: {
    borderWidth: 0,
    backgroundColor: "#F6F2F2",
    borderRadius: 8,
  },

  chipText: {
    fontFamily: "inter-regular",
    fontSize: 12,
    color: "black",
  },
});
