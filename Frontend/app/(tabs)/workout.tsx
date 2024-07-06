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
import TextBox from "@/components/general/textBox/textBox";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export type WorkoutData = {
  name: string;
  weight: number;
  sets: number;
  reps: number;
  rests: number;
};

export default function Workout() {
  const [workoutData, setWorkoutData] = useState<WorkoutData[]>([]);
  const [message, setMessage] = useState<string>("");
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => {
    setRefresh(prevRefresh => !prevRefresh);
  };

  return (
    <View style={{ ...globalStyles.container, padding: 12 }}>
      <PageHeader topText="AI-Based" bottomText="Workout Recommendation" />
      <View style={{ position: "relative", bottom: 28 }}>
        <Text style={globalStyles.para}>
          Click on the button below and fill up the form to get your workout
          recommendation!
        </Text>
      </View>

      <WorkoutModal setWorkoutData={setWorkoutData} setMessage={setMessage} />
      <View style={styles.secondaryHeader}>
        <PageHeader topText="" bottomText="Suggested Workout" />
        <TouchableOpacity onPress={handleRefresh}>
          <Ionicons
            size={25}
            name="reload-outline"
            style={{ position: "relative", right: 30, bottom: 18 }}
          />
        </TouchableOpacity>
      </View>
      {workoutData.length > 0 ? <Table workoutData={workoutData} refresh={refresh} /> : <></>}
      {message ? <TextBox message={message} />: <></>}
      {/* <View
        style={{
          marginTop: 19.5,
          marginBottom: 7,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      ></View> */}

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
  secondaryHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

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
