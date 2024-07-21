import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { modalStyles } from "../../../styles/modal";
import { globalStyles } from "../../../styles/global";
import { useState } from "react";
import EditForm from "../../form/full/edit";
import Ionicons from "@expo/vector-icons/Ionicons";
import GeneralModalTemplate from "../templates/generalModalTemplate";

export default function EditModal({ triggerUpdate }: any) {
  const [visibility, setVisibility] = useState<boolean>(false);
  const submitHandler = () => {
    setVisibility(false);
    triggerUpdate();
  };

  return (
    <>
      <TouchableOpacity onPress={() => setVisibility(true)}>
        <Ionicons name="create-outline" size={25} style={modalStyles.icon} />
      </TouchableOpacity>

      <GeneralModalTemplate
        visibleState={visibility}
        additionalStyles={styles.modalHeight}
      >
        <KeyboardAvoidingView
          style={globalStyles.container}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.headerWrapper}>
            <Text style={globalStyles.header}>Edit Account Details</Text>
            <TouchableOpacity onPress={() => setVisibility(false)}>
              <Ionicons name="close-circle-outline" size={25}></Ionicons>
            </TouchableOpacity>
          </View>

          <EditForm submitHandler={submitHandler} />
        </KeyboardAvoidingView>
      </GeneralModalTemplate>
    </>
  );
}

const styles = StyleSheet.create({
  modalHeight: {
    height: 620,
  },

  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
