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
import WeightWorkoutForm from "@/components/form/full/weightWorkout";

export default function WeightWorkoutModal({setWeightWorkoutData, setMessage, clearAll}: any) {
  const [weightWorkoutModal, setWeightWorkoutModal] = useState<boolean>(false);
  const [modalHeight, setModalHeight] = useState<number>(0);

  const handleLayout = (event: any) => {
    event.persist(); // Persist the event
    const { height } = event.nativeEvent.layout;
    setModalHeight(height);
  };

  return (
    <>
      <SubmitButton
        onPressHandler={() => setWeightWorkoutModal(true)}
        text="Weight Workout"
        style={{ flex: 1, marginHorizontal: 5 }}
      />

      {weightWorkoutModal == true && (
        <Modal animationType="fade" visible={weightWorkoutModal} transparent={true}>
          <View style={modalStyles.modalWrapper}>
            <View
              style={{
                ...modalStyles.modalContent,
                paddingLeft: 6,
              }}
              // keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
              // behavior={Platform.OS === "ios" ? "padding" : undefined}
              onLayout={handleLayout}
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
                  Plan for your next gym session:
                </Text>
                <TouchableOpacity onPress={() => setWeightWorkoutModal(false)}>
                  <Ionicons name="close-circle-outline" size={25}></Ionicons>
                </TouchableOpacity>
              </View>

              <WeightWorkoutForm
                setWeightWorkoutModal={setWeightWorkoutModal}
                setWeightWorkoutData={setWeightWorkoutData}
                setMessage={setMessage}
                clearAll={clearAll}
                weightWorkoutModalHeight={modalHeight}
              />
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}
