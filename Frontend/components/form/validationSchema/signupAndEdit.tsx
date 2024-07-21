import * as yup from "yup";

function heightTest(value: string) {
  const floatValue: number = parseFloat(value);
  if (isNaN(floatValue)) {
    return false;
  }

  return floatValue >= 1 && floatValue <= 5;
}

function weightTest(value: string) {
  const floatValue: number = parseFloat(value);
  if (isNaN(floatValue)) {
    return false;
  }

  return floatValue >= 30;
}

function birthdayTest(value: Date) {
  const currentDate: Date = new Date();
  let ageDiff: number = currentDate.getFullYear() - value.getFullYear();
  const monthDiff: number = currentDate.getMonth() - value.getMonth();

  // If the current month is before the birth month or in the same month but birth day is ahead of current day
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && currentDate.getDate() < value.getDate())
  ) {
    ageDiff--;
  }
  console.log(value);
  // Check if the person is at least 13 years old
  return ageDiff >= 13;
}

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
