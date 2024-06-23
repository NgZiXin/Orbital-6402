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
import EditForm from "../../form/full/edit";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function EditModal({ triggerUpdate }: any) {
  const [editModal, setEditModal] = useState(false);
  const submitHandler = () => {
    setEditModal(false);
    triggerUpdate();
  };

  return (
    <>
      <TouchableOpacity onPress={() => setEditModal(true)}>
        <Ionicons name="create-outline" size={25} style={modalStyles.icon} />
      </TouchableOpacity>

      {editModal == true && (
        <Modal animationType="fade" visible={editModal} transparent={true}>
          <View style={modalStyles.modalWrapper}>
            <View style={{ ...modalStyles.modalContent, height: "75%" }}>
              <KeyboardAvoidingView
                style={globalStyles.container}
                keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
              >
                <View style={{ width: "100%", height: "100%" }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={globalStyles.header}>
                      Edit Account Details
                    </Text>
                    <TouchableOpacity onPress={() => setEditModal(false)}>
                      <Ionicons
                        name="close-circle-outline"
                        size={25}
                      ></Ionicons>
                    </TouchableOpacity>
                  </View>

                  <EditForm submitHandler={submitHandler} />
                </View>
              </KeyboardAvoidingView>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}
