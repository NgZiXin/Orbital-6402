import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";
import { removeToken } from "@/utility/userToken";
import { modalStyles } from "../../../styles/modal";
import { globalStyles } from "../../../styles/global";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import GeneralModalTemplate from "../templates/generalModalTemplate";

export default function LogoutModal() {
  const [visibility, setVisibility] = useState<boolean>(false);
  return (
    <>
      <TouchableOpacity onPress={() => setVisibility(true)}>
        <Ionicons name="log-out-outline" size={25} style={styles.icon} />
      </TouchableOpacity>

      <GeneralModalTemplate visibleState={visibility}>
        <View style={styles.contentWrapper}>
          <Text style={globalStyles.header}>Confirmation</Text>
          <Text style={globalStyles.para}>
            Are you sure you want to log out?
          </Text>
          <View style={styles.buttonWrapper}>
            <Link
              href="./profile"
              style={styles.commonButton}
              onPress={() => setVisibility(false)}
            >
              No
            </Link>
            <Link
              replace
              href="../login"
              style={styles.commonButton}
              onPress={() => {
                // Destroy the token string
                // So that after logout, close app, open app again
                // User will be redirected in login page instead of profile page again!
                removeToken("token");
                setVisibility(false);
              }}
            >
              Yes
            </Link>
          </View>
        </View>
      </GeneralModalTemplate>
    </>
  );
}

const styles = StyleSheet.create({
  icon: {
    ...modalStyles.icon,
    marginBottom: -2,
  },

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
