import { ScrollView, View, Alert } from "react-native";
import { globalStyles } from "../../../styles/global";
import { Formik, FormikHelpers } from "formik";
import { useState } from "react";
import SubmitButton from "../../general/submit";
import { getToken } from "@/utility/general/userToken";
import { useLoading } from "@/hooks/useLoading";

import DistanceField from "../fragments/workoutFields/runWorkoutFields/distance";
import DurationPicker from "../fragments/workoutFields/runWorkoutFields/duration";
import WeekSlider from "../fragments/workoutFields/runWorkoutFields/week";
import HealthConditions from "../fragments/workoutFields/healthConditions";
import OtherRemarks from "../fragments/workoutFields/otherRemarks";

type RunWorkoutValues = {
  distance: number;
  duration_hours: number;
  duration_minutes: number;
  duration_seconds: number;
  weeks: number;
  healthConds: string;
  otherRemarks: string;
};

const initialValues: RunWorkoutValues = {
  distance: 10.0,
  duration_hours: 1,
  duration_minutes: 10,
  duration_seconds: 0,
  weeks: 4,
  healthConds: "",
  otherRemarks: "",
};

export default function RunWorkoutForm({
  setRunWorkoutModal,
  setRunWorkoutData,
  setMessage,
  clearAll,
}: any) {
  const { showLoading, hideLoading } = useLoading();
  const [scroll, setScroll] = useState(true);

  const handleSubmit = async (
    values: RunWorkoutValues,
    actions: FormikHelpers<RunWorkoutValues>
  ): Promise<void> => {
    try {
      // Set Loading Screen
      setRunWorkoutModal(false);
      showLoading();

      // Query backend
      const duration: string =
        values.duration_hours +
        "hour : " +
        values.duration_minutes +
        "minutes : " +
        values.duration_seconds +
        "seconds";
      const token: string | null = await getToken("token");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_DOMAIN}workout/get_run_training/?distance=${values.distance}&duration=${duration}&weeks=${values.weeks}&healthConds=${values.healthConds}&otherRemarks=${values.otherRemarks}`,
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
        setRunWorkoutData(dataObj["exercises"]);
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
            <DistanceField formikProps={formikProps} />
            <DurationPicker formikProps={formikProps} />
            <WeekSlider formikProps={formikProps} setScroll={setScroll} />
            <HealthConditions formikProps={formikProps} />
            <OtherRemarks formikProps={formikProps} />
            <SubmitButton
              onPressHandler={() => formikProps.handleSubmit()}
              text="Create Run Workout"
              style={{ position: "relative", left: 9, width: "95%" }}
            />
          </ScrollView>
        )}
      </Formik>
    </>
  );
}
