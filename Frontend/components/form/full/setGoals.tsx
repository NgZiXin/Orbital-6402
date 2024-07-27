import { ScrollView } from "react-native";
import { Formik, FormikHelpers } from "formik";
import { useLoading } from "@/hooks/useLoading";
import SubmitButton from "../../general/submit";
import WorkoutCountField from "../fragments/setGoalsFields/workoutCount";
import TotalHoursField from "../fragments/setGoalsFields/totalHours";
import TotalKilometersField from "../fragments/setGoalsFields/totalKilometers";
import AchievementsField from "../fragments/setGoalsFields/achievements";
import setGoalsValidationSchema from "../validationSchema/setGoals";

interface SetGoalsFormValues {
  workoutCount?: number;
  totalHours?: number;
  totalKilometers?: number;
  achievements?: number;
}

interface SetGoalsFormProps {
  setWeekGoalValues: (value: number[]) => void;
  setGoalsModal: (value: boolean) => void;
  setUpdate: (value: boolean | ((prev: boolean) => boolean)) => void;
}

export default function SetGoalsForm({
  setWeekGoalValues,
  setGoalsModal,
  setUpdate,
}: SetGoalsFormProps) {
  const { showLoading, hideLoading } = useLoading();

  const handleSubmit = (
    values: SetGoalsFormValues,
    actions: FormikHelpers<SetGoalsFormValues>
  ): void => {
    try {
      showLoading();

      // Build the new values array
      const valuesArray: number[] = [];

      // Formik only runs handleSubmit if all validation passes
      // Thus, the values at this stage are guarenteed to be numbers
      valuesArray[0] = values.workoutCount as number;
      valuesArray[1] = values.achievements as number;
      valuesArray[2] = values.totalKilometers as number;
      valuesArray[3] = values.totalHours as number;

      // Trigger a bunch of relevant state variable updates & re-renders
      actions.resetForm();
      setWeekGoalValues(valuesArray);
      setUpdate((prev: boolean) => !prev);
      setGoalsModal(false);

      // Catch any errors
    } catch (error: any) {
      console.error(error);
    } finally {
      hideLoading();
    }
  };

  return (
    <>
      <Formik
        // All set to undefined
        // So that the required() validation triggers if values are undefined onSubmit
        initialValues={
          {
            workoutCount: undefined,
            totalHours: undefined,
            totalKilometers: undefined,
            achievements: undefined,
          } as SetGoalsFormValues
        }
        validationSchema={setGoalsValidationSchema}
        // Optimization to minimize operations
        // Form just validates on blur and submit
        validateOnChange={false}
        onSubmit={handleSubmit}
      >
        {(formikProps) => (
          // ScrollView seems to include the keyboard.dismiss feature
          // Thats why its being used here instead of normal view
          <ScrollView showsVerticalScrollIndicator={false}>
            <WorkoutCountField formikProps={formikProps} />
            <TotalHoursField formikProps={formikProps} />
            <TotalKilometersField formikProps={formikProps} />
            <AchievementsField formikProps={formikProps} />
            <SubmitButton
              onPressHandler={formikProps.handleSubmit}
              text="Set Goals"
            />
          </ScrollView>
        )}
      </Formik>
    </>
  );
}
