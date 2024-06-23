import { ScrollView, StyleSheet, View } from "react-native";
import { globalStyles } from "../../../styles/global";
import { Formik, FormikHelpers } from "formik";
import { useState } from "react";
import SubmitButton from "../../general/submit";

import FitnessLevel from "../fragments/workoutDetails/fitnessLevel";
import NumExercise from "../fragments/workoutDetails/numExercise";
import MuscleGroups from "../fragments/workoutDetails/muscleGroups";
import HealthConditions from "../fragments/workoutDetails/healthConditions";
import OtherRemarks from "../fragments/workoutDetails/otherRemarks";

export default function WorkoutForm({ setWorkoutModal }: any) {
  const [scroll, setScroll] = useState(true);
  const handleSubmit = () => {
    setWorkoutModal(false);
  };

  return (
    <View style={globalStyles.container}>
      <Formik
        initialValues={{
          fitnessLevel: 5,
          numExercise: 5,
          muscleGroups: [],
          healthCond: "",
          otherRemarks: "",
        }}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={handleSubmit}
      >
        {(formikProps) => (
          <ScrollView
            showsVerticalScrollIndicator={false}
            scrollEnabled={scroll}
          >
            <FitnessLevel formikProps={formikProps} setScroll={setScroll} />
            <NumExercise formikProps={formikProps} setScroll={setScroll} />
            <MuscleGroups formikProps={formikProps} />
            <HealthConditions formikProps={formikProps} />
            <OtherRemarks formikProps={formikProps} />
            <SubmitButton
              onPressHandler={() => formikProps.handleSubmit()}
              text="Create Workout"
            />
          </ScrollView>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({});
