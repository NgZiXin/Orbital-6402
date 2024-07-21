import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { globalStyles } from "../../../styles/global";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import SubmitButton from "@/components/general/submit";
import FindNearestForm from "@/components/form/full/findNearest";
import GeneralModalTemplate from "../templates/generalModalTemplate";

export default function FindNearestModal({ setWebviewUri }: any) {
  const [visibility, setVisibility] = useState<boolean>(false);

  return (
    <>
      <SubmitButton
        onPressHandler={() => setVisibility(true)}
        text="Find Nearest Gym & Park"
        style={styles.submitButton}
      />

      <GeneralModalTemplate
        visibleState={visibility}
        additionalStyles={styles.paddingAdjustment}
      >
        <View style={styles.headerWrapper}>
          <Text style={styles.modalHeader}>Find Nearest Gym & Park</Text>
          <TouchableOpacity onPress={() => setVisibility(false)}>
            <Ionicons name="close-circle-outline" size={25}></Ionicons>
          </TouchableOpacity>
        </View>

        <FindNearestForm
          setWebviewUri={setWebviewUri}
          setFindNearestModal={setVisibility}
        />
      </GeneralModalTemplate>
    </>
  );
}

const styles = StyleSheet.create({
  submitButton: {
    position: "relative",
    bottom: "5%",
    // marginBottom: "-5%",
  },

  paddingAdjustment: {
    paddingLeft: 6,
  },

  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  modalHeader: {
    ...globalStyles.header,
    position: "relative",
    left: 9,
  },
});
