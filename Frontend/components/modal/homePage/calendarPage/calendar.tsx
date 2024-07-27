import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { globalStyles } from "../../../../styles/global";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import SubmitButton from "@/components/general/submit";
import AgendaCalendar from "@/components/general/agendaCalendar";
import AddAgendaModal from "./addAgenda";
import GeneralModalTemplate from "../../templates/generalModalTemplate";

export default function CalendarModal() {
  const [visibility, setVisibility] = useState<boolean>(false);
  const [updateFlag, setUpdateFlag] = useState<boolean>(false);

  return (
    <>
      <SubmitButton
        onPressHandler={() => setVisibility(true)}
        text="View Calendar"
        style={styles.submitButton}
      />

      <GeneralModalTemplate
        visibleState={visibility}
        additionalStyles={styles.modalDimmensions}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.headerWrapper}>
            <Text style={globalStyles.header}>Workout Calendar</Text>
            <TouchableOpacity onPress={() => setVisibility(false)}>
              <Ionicons name="close-circle-outline" size={25}></Ionicons>
            </TouchableOpacity>
          </View>

          <AgendaCalendar
            updateFlag={updateFlag}
            setUpdateFlag={setUpdateFlag}
          />
          <AddAgendaModal setUpdateFlag={setUpdateFlag} />
        </KeyboardAvoidingView>
      </GeneralModalTemplate>
    </>
  );
}

const styles = StyleSheet.create({
  submitButton: {
    position: "relative",
    bottom: 25,
    marginBottom: 27,
  },

  modalDimmensions: {
    width: "95%",
    height: "93.5%",
  },

  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 3,
  },
});
