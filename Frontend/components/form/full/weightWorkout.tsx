import { ScrollView, View, Alert } from "react-native";
import { globalStyles } from "../../../styles/global";
import { Formik, FormikHelpers } from "formik";
import { useState } from "react";
import SubmitButton from "../../general/submit";
import { getToken } from "@/utility/userToken";
import muscleGroupsList from "@/components/modal/workoutPage/muscleGroup/helper/list";
import { useLoading } from "@/hooks/useLoading";

import FitnessLevel from "../fragments/workoutDetails/weightWorkoutDetails/fitnessLevel";
import NumExercises from "../fragments/workoutDetails/weightWorkoutDetails/numExercise";
import MuscleGroups from "../fragments/workoutDetails/weightWorkoutDetails/muscleGroups";
import HealthConditions from "../fragments/workoutDetails/healthConditions";
import OtherRemarks from "../fragments/workoutDetails/otherRemarks";

type WeightWorkoutValues = {
  fitnessLevel: number;
  numExercises: number;
  muscleGroups: string[];
  healthConds: string;
  otherRemarks: string;
};

const initialValues: WeightWorkoutValues = {
  fitnessLevel: 5,
  numExercises: 3,
  muscleGroups: [],
  healthConds: "",
  otherRemarks: "",
};

const getName = (item: string) => {
  if (item.length === 1) {
    return muscleGroupsList[Number(item) - 1].name;
  }
  return muscleGroupsList[Number(item.charAt(0)) - 1].children[
    Number(item.charAt(1)) - 1
  ].name;
};

export default function WeightWorkoutForm({
  setWeightWorkoutModal,
  setWeightWorkoutData,
  setMessage,
  clearAll,
  weightWorkoutModalHeight,
}: any) {
  const { showLoading, hideLoading } = useLoading();
  const [scroll, setScroll] = useState(true);

  const handleSubmit = async (
    values: WeightWorkoutValues,
    actions: FormikHelpers<WeightWorkoutValues>
  ): Promise<void> => {
    try {
      // Set Loading Screen
      setWeightWorkoutModal(false);
      showLoading();

      // Extract Main & Sub muscle groups
      const mainMuscleGroups = values.muscleGroups
        .filter((item: string) => item.length === 1)
        .map(getName)
        .join(", ");
      const subMuscleGroups = values.muscleGroups
        .filter((item: string) => item.length > 1)
        .map(getName)
        .join(", ");

      // Query backend
      const token: string | null = await getToken("token");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_DOMAIN}workout/get_weight_training/?fitnessLevel=${values.fitnessLevel}&numExercises=${values.numExercises}&mainMuscleGroups=${mainMuscleGroups}&subMuscleGroups=${subMuscleGroups}&healthConds=${values.healthConds}&otherRemarks=${values.otherRemarks}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorObj = await response.json();
        Alert.alert("Error", errorObj["error"]);
        throw new Error("Network response was not ok");
      }

      const dataObj = await response.json();

      // Clean up
      clearAll();

      // Response object can only be of two types, either a message or contains workoutData (i.e. proper JSON format)
      if (dataObj["exercises"]) {
        // Display Table
        setWeightWorkoutData(dataObj["exercises"]);
      } else {
        // Display AI's conversational output instead
        setMessage(dataObj["message"]);
      }

      actions.resetForm();
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      hideLoading(); // Hide loading spinner after fetch completes
    }
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
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
              workoutModalHeight={weightWorkoutModalHeight}
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
