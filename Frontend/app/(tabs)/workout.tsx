import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { globalStyles } from "@/styles/global";
import PageHeader from "@/components/general/pageHeader";
import WorkoutModal from "@/components/modal/workoutPage/workout";
import Table from "@/components/general/table/table";

export default function Workout() {
  return (
    <View style={{ ...globalStyles.container, padding: 12 }}>
      <PageHeader topText="AI-Based" bottomText="Workout Recommendation" />
      <View style={{ position: "relative", bottom: 28 }}>
        <Text style={globalStyles.para}>
          Click on the button below and fill up the form to get your workout
          recommendation!
        </Text>
      </View>

      <WorkoutModal />

      <PageHeader topText="" bottomText="Suggested Workout" />
      <Table />

      <View
        style={{
          marginTop: 19.5,
          marginBottom: 7,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity style={styles.commonButton}>
          <Text style={styles.buttonText}>Retry All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.commonButton}>
          <Text style={styles.buttonText}>Retry Missing</Text>
        </TouchableOpacity>
      </View>

      {/* Conditionally render this as whats shown when loading */}
      {/* <View style={styles.workoutPlan}>
        <View style={globalStyles.cardV2}>
            <View style={{ ...styles.cardInner, height: 170 }}>
              <Text style={globalStyles.para}>
                Result will be shown <Text style={{ color: "red" }}>here</Text>
              </Text>
            </View>
          </View>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  workoutPlan: {
    position: "relative",
    bottom: 15,
  },

  cardInner: {
    height: "auto",
    width: "100%",
    padding: 7,
  },

  buttonText: {
    ...globalStyles.header,
    fontSize: 12,
    textAlign: "center",
  },

  commonButton: {
    width: "48%",
    borderRadius: 10,
    backgroundColor: "#FFC4C4",
  },
});
