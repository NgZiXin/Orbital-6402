import { StyleSheet, Text, View } from "react-native";
import { globalStyles } from "@/styles/global";
import PageHeader from "@/components/general/pageHeader";
import CalendarModal from "@/components/modal/homePage/calendar";
// keep this for future
import SadIcon from "@/assets/icons/sad";
import HappyIcon from "@/assets/icons/happy";

export default function Calendar() {
  const clickHandler = () => {
    console.log("TODO");
  };

  return (
    <View style={{ ...globalStyles.container, padding: 12 }}>
      {/* For offset */}
      <View style={{ marginTop: 35, flex: 1 }}>
        <PageHeader topText="Planner" bottomText="Personal Calendar" />
        <View style={{ position: "relative", bottom: 28 }}>
          <Text style={globalStyles.para}>
            Click on the button below to view your calendar and your current
            workout agenda!
          </Text>
        </View>

        <CalendarModal />

        <PageHeader topText="" bottomText="Sync with Google Calendar" />
        <View style={{ position: "relative", bottom: 28, marginBottom: -10 }}>
          <Text style={globalStyles.para}>
            To sync with your Google Calendar and add your workout agenda into
            it,{" "}
            <Text style={{ color: "red" }} onPress={clickHandler}>
              click me!
            </Text>
          </Text>
        </View>

        <View style={globalStyles.cardV2}>
          <View style={styles.cardInner}>
            <Text style={globalStyles.header}>Sync Status:</Text>
            <Text style={globalStyles.para}>
              Syncing: <Text style={{ color: "red" }}>Uninitialized</Text>
            </Text>
            <HappyIcon />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardInner: {
    padding: 10,
    alignItems: "center",
  },
});
