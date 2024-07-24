import { StyleSheet, Text, View } from "react-native";
import { globalStyles } from "../../../styles/global";
import LinkStrava from "@/components/strava/LinkStrava";
import GeneralModalTemplate from "../templates/generalModalTemplate";

interface StravaReSyncModalProps {
  visibility: boolean;
  setVisibility: (value: boolean) => void;
  stravaClientID: string;
}

export default function StravaReSyncModal({
  visibility,
  setVisibility,
  stravaClientID,
}: StravaReSyncModalProps) {
  return (
    <GeneralModalTemplate visibleState={visibility}>
      <Text style={styles.modalHeader}>Oops!</Text>
      <Text style={globalStyles.para}>
        We have revoked your Strava account's access to our app due to maximum
        capacity.
      </Text>
      <Text style={globalStyles.para}>
        Please re-sync your Strava account to continue using our services. We
        apologize for the inconvenience!
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
