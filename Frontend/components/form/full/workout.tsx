import { ScrollView, View } from "react-native";
import { globalStyles } from "../../../styles/global";
import { Formik, FormikHelpers } from "formik";
import { useState } from "react";
import SubmitButton from "../../general/submit";

import FitnessLevel from "../fragments/workoutDetails/fitnessLevel";
import NumExercises from "../fragments/workoutDetails/numExercise";
import MuscleGroups from "../fragments/workoutDetails/muscleGroups";
import HealthConditions from "../fragments/workoutDetails/healthConditions";
import OtherRemarks from "../fragments/workoutDetails/otherRemarks";

export default function WorkoutForm({
  setWorkoutModal,
  workoutModalHeight,
}: any) {
  const [scroll, setScroll] = useState(true);
  const handleSubmit = () => {
    setWorkoutModal(false);
  };

  return (
    <>
      <Formik
        initialValues={{
          fitnessLevel: 5,
          numExercises: 3,
          muscleGroups: [],
          healthConds: "",
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
            <NumExercises formikProps={formikProps} setScroll={setScroll} />
            <MuscleGroups
              formikProps={formikProps}
              workoutModalHeight={workoutModalHeight}
            />
            <HealthConditions formikProps={formikProps} />
            <OtherRemarks formikProps={formikProps} />
            <SubmitButton
              onPressHandler={() => formikProps.handleSubmit()}
              text="Create Workout"
              style={{ position: "relative", left: 9, width: "95%" }}
            />
          </ScrollView>
        )}
      </Formik>
    </>
  );
}
