import FindNearestModal from "@/components/modal/locationPage/findNearest";
import { Text, StyleSheet, View } from "react-native";
import { globalStyles } from "../../styles/global";
import PageHeader from "@/components/general/pageHeader";
import SubmitButton from "@/components/general/submit";
import { useNavigation, useRouter } from "expo-router";

export default function Location() {
  const navigation: any = useNavigation();
  const router = useRouter();

  return (
    <View style={globalStyles.container}>
      <View style={styles.contentWrapper}>
        <PageHeader topText="Finder" bottomText="Find Nearest Gym & Park" />
        <Text style={styles.text}>
          Click to search for nearby gym & parks! Fill up the form that appears
          afterwards to indicate your criteria.
        </Text>

        <FindNearestModal router={router} />

        <View style={styles.bottomHalfWrapper}>
          <PageHeader topText="" bottomText="Explore Running Routes" />
          <Text style={styles.text}>
            Click to explore various cool running routes! You will be redirected
            to a separate page to view the routes.
          </Text>
          <SubmitButton
            text="View Routes"
            onPressHandler={() => navigation.navigate("runningRoute")}
            style={styles.submitButton}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentWrapper: {
    padding: 12,
  },

  text: {
    ...globalStyles.para,
    position: "relative",
    top: -28,
  },

  bottomHalfWrapper: {
    marginTop: 45,
  },

  submitButton: {
    position: "relative",
    bottom: "9%",
  },
});
