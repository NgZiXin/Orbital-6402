import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { globalStyles } from "../../../styles/global";
import GeneralModalTemplate from "../templates/generalModalTemplate";
import SubmitButton from "@/components/general/submit";

interface WeekToggleModalProps {
  visibility: boolean;
  setVisibility: (visible: boolean) => void;
}

export default function WeekToggleModal({
  visibility,
  setVisibility,
}: WeekToggleModalProps) {
  return (
    <>
      <GeneralModalTemplate visibleState={visibility}>
        <View style={styles.headerWrapper}>
          <Text style={globalStyles.header}>Notification</Text>
        </View>

        <View>
          <Text style={globalStyles.para}>
            You cannot toggle to a date beyond this week!
          </Text>

          <SubmitButton
            onPressHandler={() => setVisibility(false)}
            text="Ok"
            style={styles.submitButton}
          />
        </View>
      </GeneralModalTemplate>
    </>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  submitButton: {
    width: "40%",
    borderRadius: 15,
    backgroundColor: "#FFC4C4",
    alignSelf: "flex-end",
    marginTop: 5,
    marginBottom: 7,
  },
});
