import { Alert, StyleSheet } from "react-native";
import { getItem } from "../general/asyncStorage";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import SubmitButton from "../general/submit";

const SCOPE =
  "read,read_all,profile:read_all,profile:write,activity:read_all,activity:write";

export default function LinkStrava() {
  // Create deepl link url
  const redirect_uri = Linking.createURL("");

  const handleSubmit = async () => {
    // getItem('token') returns a Promise
    // hence, we await to wait for the Promise to complete and grab its value
    const token: string | null = await getItem("token");

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_DOMAIN}strava_api/check_auth`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    if (data["status"] == "Success") {
      Alert.alert("Sync", "Success");
    } else {
      console.log(`https://www.strava.com/oauth/authorize?client_id=${data["CLIENT_ID"]}&redirect_uri=${redirect_uri}&response_type=code&scope=${SCOPE}`);

      WebBrowser.openAuthSessionAsync(
        `https://www.strava.com/oauth/authorize?client_id=${data["CLIENT_ID"]}&redirect_uri=${redirect_uri}&response_type=code&scope=${SCOPE}`,
        redirect_uri
      ).then((result) => {
        if (result.type === "success" && result.url) {
          const { queryParams } = Linking.parse(result.url);
          // Handle the queryParams
          if (queryParams && queryParams["code"] && queryParams["scope"]) {
            fetch(
              `${process.env.EXPO_PUBLIC_DOMAIN}strava_api/get_token/?code=${queryParams["code"]}&scope=${queryParams["scope"]}/`,
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
              Alert.alert("Sync", "Success");
            });
          } else {
            Alert.alert("Sync", "Failed");
          }
        }
      });
    }
  };

  return (
    <SubmitButton
      onPressHandler={handleSubmit}
      text="Sync With Strava"
      style={styles.extra}
    />
  );
}

const styles = StyleSheet.create({
  extra: {
    alignSelf: "center",
    width: "95%",
    marginTop: "-5%",
  },
});
