import {
  Alert,
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { globalStyles } from "../styles/global";
import { REACT_APP_DOMAIN } from "@env";
import { getItem } from "../utility/asyncStorage";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

export default function LinkStrava() {
  const handleSubmit = async () => {
    // getItem('token') returns a Promise
    // hence, we await to wait for the Promise to complete and grab its value
    const token: string | null = await getItem("token");
    const redirect_uri = Linking.createURL(""); // TODO: Bring app back to profile page and not home page
    fetch(
      `http://${REACT_APP_DOMAIN}:8000/strava_api/get_access/?redirect_uri=${redirect_uri}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data["strava_auth_url"]) {
          console.log(data["strava_auth_url"]);
          WebBrowser.openAuthSessionAsync(
            data["strava_auth_url"],
            redirect_uri
          ).then((result) => {
            if (result.type === "success" && result.url) {
              const { queryParams } = Linking.parse(result.url);
              console.log(queryParams);
              Alert.alert("Authorized", JSON.stringify(queryParams));
              // Handle the queryParams
              if (queryParams && queryParams["code"] && queryParams["scope"]) {
                fetch(
                  `http://${REACT_APP_DOMAIN}:8000/strava_api/get_token/?code=${queryParams["code"]}&scope=${queryParams["scope"]}/`,
                  {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Token ${token}`,
                    },
                  }
                ).then((response) => {
                  if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                  }
                  Alert.alert("Authorization", "Success")
                });
              } else {
                Alert.alert("Authorization", "Failed");
              }
            } else {
              Alert.alert("Authorization", "Failed");
            }
          });
        } else {
          Alert.alert("Sync Status", "Success");
        }
      })
      .catch((error) => {
        // Logging any errors
        console.error("Error fetching data:", error);
      });
  };

  return (
    <TouchableWithoutFeedback onPress={handleSubmit}>
      <View style={styles.syncButton}>
        <Text
          style={{
            ...globalStyles.header,
            letterSpacing: 0,
            textAlign: "center",
          }}
        >
          Sync with Strava!
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  syncButton: {
    width: "100%",
    marginTop: "-5%",
    padding: 5,
    borderRadius: 15,
    backgroundColor: "#FFC4C4",
  },
});