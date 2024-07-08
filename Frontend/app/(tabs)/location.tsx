import FindNearestModal from "@/components/modal/locationPage/findNearest";
import { Text, View, StyleSheet } from "react-native";
import { useState } from "react";
import { WebView } from "react-native-webview";
import { globalStyles } from "../../styles/global";
import PageHeader from "@/components/general/pageHeader";
import SubmitButton from "@/components/general/submit";
import { useNavigation } from "expo-router";

export default function Location() {
  const navigation: any = useNavigation();
  const [webviewUri, setWebviewUri] = useState(``);

  return (
    <View style={globalStyles.container}>
      <View style={{ padding: 12 }}>
        <PageHeader topText="Finder" bottomText="Find Nearest Gym & Park" />
        <Text style={styles.buttonText}>
          Click to search for nearby gym & parks!
        </Text>
        <FindNearestModal setWebviewUri={setWebviewUri} />
        {webviewUri ? (
          <View style={{ padding: 7, height: 250, position: "relative" }}>
            <WebView
              javaScriptEnabled={true}
              startInLoadingState={true}
              source={{
                uri: webviewUri,
              }}
            />
          </View>
        ) : (
          <></>
        )}
        <View style={{ marginTop: 20 }}>
          <PageHeader topText="" bottomText="Explore Running Routes" />
          <Text style={styles.routesText}>
            {
              "Click to explore various cool running routes! "
            }
            <Text style={{ color: "red" }}>
              Sync with Strava at profile page to display segments.
            </Text>
          </Text>
          <SubmitButton
            text="View Routes"
            onPressHandler={() => navigation.navigate("runningRoute")}
            style={{ marginTop: "-6%" }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    ...globalStyles.para,
    position: "relative",
    top: -30,
  },

  routesText: {
    ...globalStyles.para,
    position: "relative",
    bottom: 30,
  },
});
