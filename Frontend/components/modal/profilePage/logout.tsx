import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";

import { modalStyles } from "../../../styles/modal";
import { globalStyles } from "../../../styles/global";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function LogoutModal() {
  const [logoutModal, setLogoutModal] = useState(false);
  return (
    <>
      <TouchableOpacity onPress={() => setLogoutModal(true)}>
        <Ionicons
          name="log-out-outline"
          size={25}
          style={{ ...modalStyles.icon, marginBottom: -2 }}
        />
      </TouchableOpacity>

      {logoutModal == true && (
        <Modal animationType="fade" visible={logoutModal} transparent={true}>
          <View style={modalStyles.modalWrapper}>
            <View style={{ ...modalStyles.modalContent, height: 180 }}>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Text style={globalStyles.header}>Confirmation</Text>
                <Text style={globalStyles.para}>
                  Are you sure you want to log out?
                </Text>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                >
                  <Link
                    href="./profile"
                    style={styles.commonButton}
                    onPress={() => setLogoutModal(false)}
                  >
                    No
                  </Link>
                  <Link
                    href="../login"
                    style={styles.commonButton}
                    onPress={() => setLogoutModal(false)}
                  >
                    Yes
                  </Link>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  commonButton: {
    width: "45%",
    textAlign: "center",
    borderRadius: 15,
    backgroundColor: "#FFC4C4",
    ...globalStyles.header,
    fontSize: 12,
    paddingVertical: 8,
  },
});
