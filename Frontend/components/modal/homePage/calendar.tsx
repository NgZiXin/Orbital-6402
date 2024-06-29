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
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import SubmitButton from "@/components/general/submit";
import AgendaCalendar from "@/components/general/agendaCalendar";

export default function CalendarModal() {
  const [calendarModal, setCalendarModal] = useState<boolean>(false);
  return (
    <>
      <SubmitButton
        onPressHandler={() => setCalendarModal(true)}
        text="View Calendar"
        style={{ position: "relative", bottom: 25, marginBottom: 27 }}
      />

      {calendarModal == true && (
        <Modal animationType="slide" visible={calendarModal} transparent={true}>
          <View style={modalStyles.modalWrapper}>
            <View
              style={{
                ...modalStyles.modalContent,
                width: "95%",
                height: "93.5%",
              }}
            >
              <KeyboardAvoidingView
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 3,
                  }}
                >
                  <Text style={globalStyles.header}>Workout Calendar</Text>
                  <TouchableOpacity onPress={() => setCalendarModal(false)}>
                    <Ionicons name="close-circle-outline" size={25}></Ionicons>
                  </TouchableOpacity>
                </View>

                <AgendaCalendar />
              </KeyboardAvoidingView>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}
