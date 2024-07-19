import { Alert, StyleSheet } from "react-native";
import { getItem } from "../general/asyncStorage";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import SubmitButton from "../general/submit";

const SCOPE = "read,read_all,profile:read_all,activity:read_all";

export default function LinkStrava({ callback, stravaClientId }: any) {
  // Create deepl link url
  
  const redirect_uri = Linking.createURL("");

  const openAuth = async() => {
    const token: string | null = await getItem("token");

    WebBrowser.openAuthSessionAsync(
      `https://www.strava.com/oauth/authorize?client_id=${stravaClientId}&redirect_uri=${redirect_uri}&response_type=code&scope=${SCOPE}`,
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
            callback();
          });
        } else {
          Alert.alert("Sync", "Failed");
        }
      }
    });
  };

  const handleSubmit = async () => {
    const token: string | null = await getItem("token");

    // Ensure backend server has cleared data and have space for user to seek authorization
    fetch(
      `${process.env.EXPO_PUBLIC_DOMAIN}strava_api/clear_auth/`,
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

      // Start oauth process
      openAuth();
    });
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
