import { StyleSheet, Text, View, Modal } from "react-native";
import { globalStyles } from "../../styles/global";
import LinkStrava from "@/components/strava/LinkStrava";

export default function StravaSyncOverlay({
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
        <Text style={styles.syncHeader}>
          Sync
          <Text style={{ color: "#fc4c02" }}> STRAVA</Text>
        </Text>
        <Text style={styles.syncBody}>
          Our app is closely integrated with the Strava App. Please sync our app
          with your Strava Account.
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
    ...globalStyles.header, fontSize: 18,
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
