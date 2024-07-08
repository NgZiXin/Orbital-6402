import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { modalStyles } from "../../../styles/modal";
import { globalStyles } from "../../../styles/global";
import { useState, useEffect, useRef } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import SubmitButton from "@/components/general/submit";
import RunWorkoutForm from "@/components/form/full/runWorkout";

export default function RunWorkoutModal({setRunWorkoutData, setMessage, clearAll}: any) {
  const [runWorkoutModal, setRunWorkoutModal] = useState<boolean>(false);

  return (
    <>
      <SubmitButton
        onPressHandler={() => setRunWorkoutModal(true)}
        text="Run Regime"
        style={{ flex: 1, marginHorizontal: 5 }}
      />

      {runWorkoutModal == true && (
        <Modal animationType="fade" visible={runWorkoutModal} transparent={true}>
          <View style={modalStyles.modalWrapper}>
            <View
              style={{
                ...modalStyles.modalContent,
                paddingLeft: 6,
              }}
              // keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
              // behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    ...globalStyles.header,
                    position: "relative",
                    left: 9,
                  }}
                >
                  Plan for your next big race:
                </Text>
                <TouchableOpacity onPress={() => setRunWorkoutModal(false)}>
                  <Ionicons name="close-circle-outline" size={25}></Ionicons>
                </TouchableOpacity>
              </View>

              <RunWorkoutForm
                setRunWorkoutModal={setRunWorkoutModal}
                setRunWorkoutData={setRunWorkoutData}
                clearAll={clearAll}
                setMessage={setMessage}
              />
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}
