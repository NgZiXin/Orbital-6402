import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { modalStyles } from "../../../styles/modal";
import { globalStyles } from "../../../styles/global";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function SyncModal() {
  const [syncModal, setSyncModal] = useState(false);
  return (
    <>
      <TouchableOpacity onPress={() => setSyncModal(true)}>
        <Ionicons
          name="information-circle-outline"
          size={20}
          color="red"
          style={{ position: "relative", left: 5, top: 1.8 }}
        />
      </TouchableOpacity>

      {syncModal == true && (
        <Modal animationType="fade" visible={syncModal} transparent={true}>
          <View style={modalStyles.modalWrapper}>
            <View style={modalStyles.modalContent}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={globalStyles.header}>Strava Sync</Text>
                <TouchableOpacity onPress={() => setSyncModal(false)}>
                  <Ionicons name="close-circle-outline" size={25}></Ionicons>
                </TouchableOpacity>
              </View>

              <ScrollView>
                <Text
                  style={{
                    ...globalStyles.para,
                    position: "relative",
                    bottom: 10,
                  }}
                >
                  Log in to your Strava account, and go to the settings page.
                  Use the authorization code displayed below to sync with your
                  Strava account!
                </Text>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}
