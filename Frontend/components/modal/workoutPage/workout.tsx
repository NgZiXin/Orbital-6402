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
import WorkoutForm from "@/components/form/full/workout";

export default function WorkoutModal() {
  const [workoutModal, setWorkoutModal] = useState<boolean>(false);
  const [modalHeight, setModalHeight] = useState<number>(0);

  const handleLayout = (event: any) => {
    event.persist(); // Persist the event
    const { height } = event.nativeEvent.layout;
    setModalHeight(height);
  };

  return (
    <>
      <SubmitButton
        onPressHandler={() => setWorkoutModal(true)}
        text="Create Workout"
        style={{ position: "relative", bottom: 25, marginBottom: 19 }}
      />

      {workoutModal == true && (
        <Modal animationType="fade" visible={workoutModal} transparent={true}>
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
                  Workout Planner
                </Text>
                <TouchableOpacity onPress={() => setWorkoutModal(false)}>
                  <Ionicons name="close-circle-outline" size={25}></Ionicons>
                </TouchableOpacity>
              </View>

              <WorkoutForm
                setWorkoutModal={setWorkoutModal}
                workoutModalHeight={modalHeight}
              />
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}
