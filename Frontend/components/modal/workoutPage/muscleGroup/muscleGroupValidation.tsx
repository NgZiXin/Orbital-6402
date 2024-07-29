import { StyleSheet, Text, View } from "react-native";

import { globalStyles } from "../../../../styles/global";
import GeneralModalTemplate from "../../templates/generalModalTemplate";
import SubmitButton from "@/components/general/submit";

interface MuscleGroupValidationModalProps {
  visibility: boolean;
  setVisibility: (visible: boolean) => void;
  topText: string;
  bottomText: string;
}

export default function MuscleGroupValidationModal({
  visibility,
  setVisibility,
  topText,
  bottomText,
}: MuscleGroupValidationModalProps) {
  return (
    <>
      <GeneralModalTemplate
        visibleState={visibility}
        additionalStyles={styles.background}
        forWrapper={true}
      >
        <Text style={globalStyles.header}>{topText}</Text>

        <View>
          <Text style={globalStyles.para}>{bottomText}</Text>

          <SubmitButton
            onPressHandler={() => setVisibility(false)}
            text="OK"
            style={styles.submitButton}
          />
        </View>
      </GeneralModalTemplate>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: "rgba(0, 0, 0, 0.35)",
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
