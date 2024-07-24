import * as yup from "yup";
import { postalCodeTest } from "@/utility/general/formTesting";

const findNearestValidationSchema = yup.object({
  radius: yup.number().required("Search radius is required"),
  choice: yup.string().required("You must choose either gym or park"),

  location: yup
    .string()
    .required("Location is required")
    .test(
      "is-valid-postal-code",
      "You must provide a valid 6 digit SG postal code",
      postalCodeTest
    ),
});

export default findNearestValidationSchema;
