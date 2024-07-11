import { StyleSheet, Text, View, Modal } from "react-native";
import { globalStyles } from "../../styles/global";
import LinkStrava from "@/components/strava/LinkStrava";

export default function StravaReSyncOverlay({
  closeSyncStrava,
  syncStrava,
  stravaClientId,
}: any) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={syncStrava}
      style={styles.modalWrapper}
    >
      <View style={styles.modalContainer}>
        <Text style={{ ...styles.syncHeader, color: "#fc4c02"}}>Oops!</Text>
        <Text style={styles.syncBody}>
          Our application has reached its maximum capacity for Strava
          connections. As a result, we have revoked your Strava account's access
          to our app. To continue using our services, please re-sync your Strava
          account. We apologize for the inconvenience caused and thank you for
          your understanding!
        </Text>
        <View style={styles.stravaWrapper}>
          <LinkStrava
            callback={closeSyncStrava}
            stravaClientId={stravaClientId}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalWrapper: {
    ...globalStyles.container,
    justifyContent: "center",
  },

  modalContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    flex: 1,
  },

  stravaWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "10%",
  },

  syncHeader: {
    ...globalStyles.header,
    fontSize: 18,
    color: "#ffffff",
  },

  syncBody: {
    ...globalStyles.para,
    textAlign: "center",
    color: "#ffffff",
  },

  syncButton: {
    width: "100%",
    padding: 5,
    borderRadius: 15,
    backgroundColor: "#FFC4C4",
  },
});
