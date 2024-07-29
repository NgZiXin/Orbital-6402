import { StyleSheet, Text, View } from "react-native";
import { globalStyles } from "@/styles/global";
import GeneralModalTemplate from "../../templates/generalModalTemplate";
import SubmitButton from "@/components/general/submit";
import { getToken } from "@/utility/general/userToken";

interface DeleteAgendaModalProps {
  visibility: boolean;
  setVisibility: (newValue: boolean) => void;
  databaseId: number;
  setUpdateFlag: (updateFunction: (prevValue: boolean) => boolean) => void;
}

export default function DeleteAgendaModal({
  visibility,
  setVisibility,
  databaseId,
  setUpdateFlag,
}: DeleteAgendaModalProps) {
  const handleCancel = (): void => {
    setVisibility(false);
  };

  const handleOk = async (): Promise<void> => {
    try {
      const token: string | null = await getToken("token");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_DOMAIN}calendar/${databaseId}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      // Backend raises an error
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setVisibility(false);
      setUpdateFlag((prev) => !prev);

      // Catch other errors
    } catch (error: any) {
      console.error(error.message);
      setVisibility(false);
    }
  };

  return (
    <>
      <GeneralModalTemplate visibleState={visibility}>
        <View style={styles.contentWrapper}>
          <Text style={globalStyles.header}>Confirmation</Text>
          <Text style={globalStyles.para}>
            Are you sure you want to delete this agenda entry?
          </Text>
          <View style={styles.buttonWrapper}>
            <SubmitButton
              onPressHandler={handleCancel}
              text="Cancel"
              style={styles.submitButton}
            />
            <SubmitButton
              onPressHandler={handleOk}
              text="Ok"
              style={styles.submitButton}
            />
          </View>
        </View>
      </GeneralModalTemplate>
    </>
  );
}

const styles = StyleSheet.create({
  contentWrapper: {
    flexDirection: "column",
    alignItems: "center",
  },

  buttonWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },

  submitButton: {
    width: "40%",
  },
});
