import Ionicons from "@expo/vector-icons/Ionicons";
import { globalStyles } from "@/styles/global";
import PageHeader from "@/utility/pageHeader";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import {
  FitnessLevel,
  NumExercise,
  HealthCond,
  OtherRemarks,
  SubmitButton,
} from "../../utility/formComponents/index";

import { Formik, FormikHelpers } from "formik";

export default function Workout() {
  const handleSubmit = () => {
    console.log("TODO");
  };
  return (
    <View style={{ ...globalStyles.container, padding: 12 }}>
      <PageHeader topText="AI-Based" bottomText="Workout Recommendation" />
      <View style={styles.workoutForm}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={{ padding: 8 }}>
            <Formik
              initialValues={{
                fitnessLevel: 1,
                numExercise: 3,
                healthCond: "",
                otherRemarks: "",
              }}
              validateOnChange={false}
              validateOnBlur={false}
              onSubmit={handleSubmit}
            >
              {(formikProps) => (
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={{ position: "relative", bottom: 10 }}>
                    <FitnessLevel formikProps={formikProps} />
                    <NumExercise formikProps={formikProps} />
                    <HealthCond formikProps={formikProps} />
                    <OtherRemarks formikProps={formikProps} />
                    <SubmitButton
                      onPressHandler={() => formikProps.handleSubmit()}
                      text="Create Workout"
                    />
                  </View>
                </ScrollView>
              )}
            </Formik>
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  workoutForm: {
    height: 500,
    backgroundColor: "#F6F2F2",
    position: "relative",
    bottom: 15,
  },
});
