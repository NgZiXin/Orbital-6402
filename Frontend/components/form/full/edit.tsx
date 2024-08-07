import React from "react";
import { Alert, ScrollView, View } from "react-native";
import { globalStyles } from "../../../styles/global";
import { Formik, FormikHelpers } from "formik";
import { getToken } from "../../../utility/general/userToken";

import UsernameField from "../fragments/accountFields/username";
import PasswordField from "../fragments/accountFields/password";
import GenderField from "../fragments/accountFields/gender";
import HeightField from "../fragments/accountFields/height";
import WeightField from "../fragments/accountFields/weight";
import BirthdayField from "../fragments/accountFields/birthday";

import SubmitButton from "../../general/submit";
import signupAndEditValidationSchema from "../validationSchema/signupAndEdit";

interface ErrorResponse {
  username: string[];
}

interface EditValues {
  username: string;
  password: string;
  height: string;
  weight: string;
  birthday: Date;
  gender: string;
}

export default function EditForm({ submitHandler }: any) {
  const handleSubmit = async (
    values: EditValues,
    actions: FormikHelpers<EditValues>
  ): Promise<void> => {
    try {
      // Custom serialization
      const body = {
        ...values,
        // Convert date to 'YYYY-MM-DD' format
        // To match expected database format
        birthday: values.birthday.toISOString().split("T")[0],
      };

      const token: string | null = await getToken("token");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_DOMAIN}accounts/data/`,
        {
          // Put request to update existing user details
          // Of the current user logged in
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      // Case where backend raises an error
      if (!response.ok) {
        const errorResponse: ErrorResponse = await response.json();
        if (errorResponse.username) {
          Alert.alert("Edit Failed", "That username already exists");
          return;
        } else {
          Alert.alert("Edit Failed", "Network error, please try again");
          return;
        }
      }

      // Handle successful edit (close edit modal)
      actions.resetForm();
      submitHandler();

      // Catches any other errors
    } catch (error: any) {
      const errorMessage = error.message;
      if (errorMessage.includes("similar")) {
        Alert.alert("Edit Failed", "Password is too similar to the username");
      } else if (errorMessage.includes("commonly used")) {
        Alert.alert(
          "Edit Failed",
          "Password cannot be a commonly used password"
        );
      } else {
        Alert.alert("Edit Failed", "Please try again");
      }
    }
  };

  return (
    <Formik
      initialValues={{
        username: "",
        password: "",
        height: "",
        weight: "",
        birthday: new Date(),
        gender: "",
      }}
      validationSchema={signupAndEditValidationSchema}
      // Optimization to minimize operations
      // Form just validates on blur and submit
      validateOnChange={false}
      onSubmit={handleSubmit}
    >
      {(formikProps) => (
        <ScrollView showsVerticalScrollIndicator={false}>
          <UsernameField formikProps={formikProps} />
          <PasswordField formikProps={formikProps} />
          <GenderField formikProps={formikProps} />
          <BirthdayField formikProps={formikProps} />
          <HeightField formikProps={formikProps} />
          <WeightField formikProps={formikProps} />

          <SubmitButton
            onPressHandler={() => formikProps.handleSubmit()}
            text="Edit Account"
          />
        </ScrollView>
      )}
    </Formik>
  );
}
