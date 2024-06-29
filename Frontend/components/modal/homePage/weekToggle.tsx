import {
  Modal,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { modalStyles } from "../../../styles/modal";
import { globalStyles } from "../../../styles/global";
import Ionicons from "@expo/vector-icons/Ionicons";

interface WeekToggleModalProps {
  setWeekToggleModal: (visible: boolean) => void;
}

export default function WeekToggleModal({
  setWeekToggleModal,
}: WeekToggleModalProps) {
  return (
    <>
      <Modal animationType="fade" transparent={true}>
        <View style={modalStyles.modalWrapper}>
          <View style={modalStyles.modalContent}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={globalStyles.header}>Notification</Text>
              <TouchableOpacity onPress={() => setWeekToggleModal(false)}>
                <Ionicons name="close-circle-outline" size={25}></Ionicons>
              </TouchableOpacity>
            </View>

            <View>
              <Text style={globalStyles.para}>
                You cannot toggle to a date beyond today!
              </Text>

              <TouchableOpacity
                style={styles.okButton}
                onPress={() => setWeekToggleModal(false)}
              >
                <Text style={styles.buttonText}>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  commonButton: {
    width: "48%",
    borderRadius: 15,
    backgroundColor: "#FFC4C4",
  },

  okButton: {
    width: "40%",
    borderRadius: 15,
    backgroundColor: "#FFC4C4",
    alignSelf: "flex-end",
    position: "relative",
    top: 12,
  },

  buttonText: {
    ...globalStyles.header,
    fontSize: 12,
    textAlign: "center",
  },
});
