import * as yup from "yup";

const findNearestValidationSchema = yup.object({
  radius: yup.number().required("Search radius is required"),
  choice: yup.string().required("You must choose either gym or park"),

  search: yup.string().required("Location is required"),
});

export default findNearestValidationSchema;
