import * as yup from "yup";
import {
  heightTest,
  weightTest,
  birthdayTest,
} from "@/utility/general/formTesting";

const signupAndEditValidationSchema = yup.object({
  username: yup
    .string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters"),

  gender: yup.string().required("Gender is required"),
  password: yup
    .string()
    .required("Password is required")
    .matches(
      /[!@#$%^&*()\-_"=+{}; :,<.>]/,
      "Password must have a special character"
    )
    .min(8, "Password must be at least 8 characters"),

  height: yup
    .string()
    .required("Height is required")
    .test("is-float-1-5", "Height must be a float between 1 - 5", heightTest),

  weight: yup
    .string()
    .required("Weight is required")
    .test("is-float-min-30", "Weight must be a float, minimum 30", weightTest),

  birthday: yup
    .date()
    .required("Birthday is required")
    .test(
      "is-older-than-13",
      "You must be at least 13 years old",
      birthdayTest
    ),
});

export default signupAndEditValidationSchema;
