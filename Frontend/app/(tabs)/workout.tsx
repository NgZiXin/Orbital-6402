import { globalStyles } from "@/styles/global";
import PageHeader from "@/components/general/pageHeader";
import WorkoutModal from "@/components/modal/workoutPage/workout";

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Workout() {
  return (
    <KeyboardAvoidingView
      style={{ ...globalStyles.container, padding: 12 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* This scrollview gives us the space to push up and overflow */}
      {/* Allowing keyboard avoiding view to work */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <PageHeader topText="AI-Based" bottomText="Workout Recommendation" />
        <View style={{ position: "relative", bottom: 28 }}>
          <Text style={globalStyles.para}>
            Click on the button below and fill up the form to get your workout
            recommendation!
          </Text>
        </View>

        <WorkoutModal />

        <PageHeader topText="" bottomText="Suggested Workout" />
        <View style={styles.workoutPlan}>
          <View style={globalStyles.cardV2}>
            <View style={{ ...styles.cardInner, height: 170 }}>
              <Text style={globalStyles.para}>
                Result will be shown <Text style={{ color: "red" }}>here</Text>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
});
