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
import WeightWorkoutModal from "@/components/modal/workoutPage/weightWorkout";
import RunWorkoutModal from "@/components/modal/workoutPage/runWorkout";
import RunTable from "@/components/general/table/runTable";
import WeightTable from "@/components/general/table/weightTable";
import TextBox from "@/components/general/textBox/textBox";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export type WeightWorkoutData = {
  name: string;
  weight: number;
  sets: number;
  reps: number;
  rests: number;
};

export type RunWorkoutData = {
  week: number;
  detail: RunWorkoutDetailData[];
};

export type RunWorkoutDetailData = {
  day: string;
  desc: string;
  distance: number;
  zone: number;
};

export default function Workout() {
  const [weightWorkoutData, setWeightWorkoutData] = useState<
    WeightWorkoutData[]
  >([]);
  const [runWorkoutData, setRunWorkoutData] = useState<RunWorkoutData[]>([]);
  const [message, setMessage] = useState<string>("");
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => {
    setRefresh((prevRefresh) => !prevRefresh);
  };

  const clearAll = () => {
    setWeightWorkoutData([]);
    setRunWorkoutData([]);
    setMessage("");
  };

  return (
    <View style={{ ...globalStyles.container, padding: 12 }}>
      <PageHeader topText="AI-Based" bottomText="Workout Recommendation" />
      <View style={{ position: "relative", bottom: 28 }}>
        <Text style={globalStyles.para}>
          Get AI suggested single-session weight workout or running training
          plan for your next big race!
        </Text>
      </View>

      <View
        style={{
          position: "relative",
          bottom: 25,
          marginBottom: 19,
          flexDirection: "row",
        }}
      >
        <WeightWorkoutModal
          setWeightWorkoutData={setWeightWorkoutData}
          setMessage={setMessage}
          clearAll={clearAll}
        />
        <RunWorkoutModal
          setRunWorkoutData={setRunWorkoutData}
          setMessage={setMessage}
          clearAll={clearAll}
        />
      </View>

      <View style={styles.secondaryHeader}>
        <PageHeader topText="" bottomText="Suggested Workout / Regime" />
        <TouchableOpacity onPress={handleRefresh}>
          <Ionicons
            size={25}
            name="reload-outline"
            style={{ position: "relative", right: 30, bottom: 18 }}
          />
        </TouchableOpacity>
      </View>

      {/* Either display Weight Workout, Run Workout, AI's message or nothing*/}
      {weightWorkoutData.length > 0 ? (
        <WeightTable weightWorkoutData={weightWorkoutData} refresh={refresh} />
      ) : runWorkoutData.length > 0 ? (
        <RunTable runWorkoutData={runWorkoutData} refresh={refresh} />
      ) : message ? (
        <TextBox message={message} />
      ) : (
        <></>
      )}
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
