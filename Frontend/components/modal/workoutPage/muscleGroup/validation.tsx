import {
  Modal,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { modalStyles } from "../../../../styles/modal";
import { globalStyles } from "../../../../styles/global";
import Ionicons from "@expo/vector-icons/Ionicons";

interface ValidationModalProps {
  setValidationModal: (visible: boolean) => void;
  topText: string;
  bottomText: string;
  handleDelete?: () => void;
  style?: StyleProp<ViewStyle>; // Optional style prop
}

export default function ValidationModal({
  setValidationModal,
  topText,
  bottomText,
  handleDelete,
  style,
}: ValidationModalProps) {
  return (
    <>
      <Modal animationType="fade" transparent={true}>
        <View style={[modalStyles.modalWrapper, style]}>
          <View style={modalStyles.modalContent}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={globalStyles.header}>{topText}</Text>
              <TouchableOpacity onPress={() => setValidationModal(false)}>
                <Ionicons name="close-circle-outline" size={25}></Ionicons>
              </TouchableOpacity>
            </View>

            <View>
              <Text style={globalStyles.para}>{bottomText}</Text>

              {/* For the workout table */}
              {handleDelete !== undefined && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    position: "relative",
                    top: 12,
                  }}
                >
                  <TouchableOpacity
                    style={styles.commonButton}
                    onPress={() => setValidationModal(false)}
                  >
                    <Text style={styles.buttonText}>No</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.commonButton}
                    onPress={() => {
                      handleDelete();
                      setValidationModal(false);
                    }}
                  >
                    <Text style={styles.buttonText}>Yes</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* For the workout form */}
              {handleDelete === undefined && (
                <TouchableOpacity
                  style={
                    bottomText.startsWith("M")
                      ? styles.shortTextOkButton
                      : styles.longTextOkButton
                  }
                  onPress={() => setValidationModal(false)}
                >
                  <Text style={styles.buttonText}>Ok</Text>
                </TouchableOpacity>
              )}
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

  shortTextOkButton: {
    width: "40%",
    borderRadius: 15,
    backgroundColor: "#FFC4C4",
    alignSelf: "flex-end",
    position: "relative",
    top: 12,
  },

  longTextOkButton: {
    width: "40%",
    borderRadius: 15,
    backgroundColor: "#FFC4C4",
    alignSelf: "flex-end",
    position: "relative",
    bottom: 10,
  },

  buttonText: {
    ...globalStyles.header,
    fontSize: 12,
    textAlign: "center",
  },
});
