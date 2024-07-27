import { StyleSheet, Text, View } from "react-native";

import { globalStyles } from "../../../../styles/global";
import GeneralModalTemplate from "../../templates/generalModalTemplate";
import SubmitButton from "@/components/general/submit";

interface StartEndTimeCheckModalProps {
  visibility: boolean;
  setVisibility: (value: boolean) => void;
  message: string;
}

export default function StartEndTimeCheckModal({
  visibility,
  setVisibility,
  message,
}: StartEndTimeCheckModalProps) {
  return (
    <>
      <GeneralModalTemplate visibleState={visibility}>
        <Text style={globalStyles.header}>Error</Text>

        <View>
          <Text style={globalStyles.para}>{message}</Text>

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
  submitButton: {
    alignSelf: "flex-end",
    width: "40%",
    marginTop: "5%",
  },
});
