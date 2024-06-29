import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { modalStyles } from "../../../../styles/modal";
import { globalStyles } from "../../../../styles/global";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import SubmitButton from "@/components/general/submit";

export default function GuideModal() {
  const [guideModal, setGuideModal] = useState(false);
  return (
    <>
      <SubmitButton
        onPressHandler={() => setGuideModal(true)}
        text="Read Guide"
        style={{ position: "relative", bottom: "23%" }}
      />

      {guideModal == true && (
        <Modal animationType="fade" visible={guideModal} transparent={true}>
          <View
            style={{
              ...modalStyles.modalWrapper,
              backgroundColor: "rgba(0, 0, 0, 0.35)",
            }}
          >
            <View style={modalStyles.modalContent}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={globalStyles.header}>Workout Creation</Text>
                <TouchableOpacity onPress={() => setGuideModal(false)}>
                  <Ionicons name="close-circle-outline" size={25}></Ionicons>
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={globalStyles.para}>
                  1. Number of main muscle groups selected must not exceed
                  number of exercises.
                </Text>
                <Text style={globalStyles.para}>
                  2. You must select a main muscle group first before selecting
                  a sub muscle group.
                </Text>
                <Text style={globalStyles.para}>
                  3. Selecting a sub muscle group means that you want exercises
                  that emphasizes on those areas.
                </Text>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}
