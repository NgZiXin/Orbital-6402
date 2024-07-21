import { StyleSheet, Text, View } from "react-native";
import { globalStyles } from "../../../styles/global";
import LinkStrava from "@/components/strava/LinkStrava";
import GeneralModalTemplate from "../templates/generalModalTemplate";

interface StravaSyncModalProps {
  visibility: boolean;
  setVisibility: (value: boolean) => void;
  stravaClientID: string;
}

export default function StravaSyncModal({
  visibility,
  setVisibility,
  stravaClientID,
}: StravaSyncModalProps) {
  return (
    <GeneralModalTemplate visibleState={visibility}>
      <Text style={styles.modalHeader}>Strava Sync</Text>
      <Text style={globalStyles.para}>
        Our app is closely integrated with the Strava App. Please sync our app
        with your Strava Account.
      </Text>
      <View style={styles.stravaWrapper}>
        <LinkStrava
          callback={() => setVisibility(false)}
          stravaClientId={stravaClientID}
        />
      </View>
    </GeneralModalTemplate>
  );
}

const styles = StyleSheet.create({
  modalHeader: {
    ...globalStyles.header,
    fontSize: 16,
  },

  stravaWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "10%",
  },
});
