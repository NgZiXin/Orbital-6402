import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { modalStyles } from "../../../../styles/modal";
import { globalStyles } from "../../../../styles/global";
import { Ionicons } from "@expo/vector-icons";

import { MaterialIcons as Icon } from "@expo/vector-icons";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import muscleGroupsList from "./list";
import MultiSelectHeader from "./header";
import MultiSelectFooter from "./footer";
import GuideModal from "./guide";

export default function MuscleGroupModal({
  setMuscleGroupModal,
  selectedItems,
  setSelectedItems,
  formikProps,
}: any) {
  function renderSelectText() {
    return "Select Muscle Groups";
  }

  function selectValidation(newItems: string[]) {
    const filterFunction = (item: string) => {
      if (item.length == 1) {
        return true;
      }

      // else, its a child entry
      // try to find a parent entry
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

  function getCount() {
    const temp = selectedItems.filter((item: string) => {
      return item.length == 1;
    });

    return temp.length;
  }

  function renderChips(props: any) {
    return (
      <View
        style={{ padding: 12, borderWidth: 1, borderRadius: 8, height: "65%" }}
      >
        <Text>
          Custom render chip function, chips will be displayed within this box!
          TODO
        </Text>
      </View>
    );
  }

  return (
    <>
      <Modal animationType="fade" visible={true} transparent={true}>
        <View style={modalStyles.modalWrapper}>
          <View style={{ ...modalStyles.modalContent, height: "68%" }}>
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
              style={{ ...globalStyles.para, position: "relative", bottom: 5 }}
            >
              Click on the button below to start planning. Read the guide if you
              are uncertain of something.
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
                onConfirm={() =>
                  formikProps.setFieldValue("muscleGroups", selectedItems)
                }
                renderSelectText={renderSelectText}
                customChipsRenderer={renderChips}
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
                  itemText: { fontFamily: "inter-semibold", fontSize: 16 },
                  subItemText: { fontFamily: "inter-regular", fontSize: 12 },
                  confirmText: { fontFamily: "inter-regular", fontSize: 16 },
                }}
              />
            </View>
            <GuideModal />
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
