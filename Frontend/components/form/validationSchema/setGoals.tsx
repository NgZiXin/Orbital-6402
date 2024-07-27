import * as yup from "yup";
import { setGoalsFieldTest } from "@/utility/general/formTesting";

const setGoalsValidationSchema = yup.object({
  workoutCount: yup
    .number()
    .required("Workout count is required")
    .test("is-valid-number", "Workout count > 0", setGoalsFieldTest),
  totalHours: yup
    .number()
    .required("Total hours is required")
    .test("is-valid-number", "Total hours > 0", setGoalsFieldTest),
  totalKilometers: yup
    .number()
    .required("Total kilometers is required")
    .test("is-valid-number", "Total kilometers > 0", setGoalsFieldTest),
  achievements: yup
    .number()
    .required("Achievements is required")
    .test("is-valid-number", "Achievements > 0", setGoalsFieldTest),
});

export default setGoalsValidationSchema;
