import * as Yup from "yup";

const runWorkoutValidationSchema = Yup.object({
  distance: Yup.number().required("Distance is required"),

  duration_hours: Yup.number()
    .integer("Hours must be an integer")
    .min(0, "Hours cannot be less than 0")
    .max(99, "Hours cannot be more than 99")
    .required("Hours are required"),

  duration_minutes: Yup.number()
    .integer("Minutes must be an integer")
    .min(0, "Minutes cannot be less than 0")
    .max(59, "Minutes cannot be more than 59")
    .required("Minutes are required"),

  duration_seconds: Yup.number()
    .integer("Seconds must be an integer")
    .min(0, "Seconds cannot be less than 0")
    .max(59, "Seconds cannot be more than 59")
    .required("Seconds are required"),
});

export default runWorkoutValidationSchema;
