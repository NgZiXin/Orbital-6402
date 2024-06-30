import React from "react";
import { Alert, ScrollView, View } from "react-native";
import { globalStyles } from "../../../styles/global";
import { Formik, FormikHelpers } from "formik";
import { getItem } from "../../general/asyncStorage";

import UsernameField from "../fragments/accountDetails/username";
import PasswordField from "../fragments/accountDetails/password";
import GenderField from "../fragments/accountDetails/gender";
import HeightField from "../fragments/accountDetails/height";
import WeightField from "../fragments/accountDetails/weight";
import BirthdayField from "../fragments/accountDetails/birthday";

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
        birthday: values.birthday.toISOString().split("T")[0], // Convert date to 'YYYY-MM-DD' format
      };

<<<<<<< HEAD
    const token: string | null = await getItem("token");
    const response = await fetch(`${process.env.EXPO_PUBLIC_DOMAIN}accounts/data/`, {
      // put request to update existing user details
      // of the current user logged in
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(body),
    });
=======
      const token: string | null = await getItem("token");
      const ip = process.env.EXPO_PUBLIC_DOMAIN;
      const response = await fetch(`http://${ip}:8000/accounts/data/`, {
        // put request to update existing user details
        // of the current user logged in
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(body),
      });
>>>>>>> frontend-skeleton

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
    <View style={globalStyles.container}>
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
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={handleSubmit}
      >
        {(formikProps) => (
          <ScrollView showsVerticalScrollIndicator={false}>
            <UsernameField formikProps={formikProps} />
            <GenderField formikProps={formikProps} />
            <PasswordField formikProps={formikProps} />
            <HeightField formikProps={formikProps} />
            <WeightField formikProps={formikProps} />
            <BirthdayField formikProps={formikProps} />

            <SubmitButton
              onPressHandler={() => formikProps.handleSubmit()}
              text="Create Account"
            />
          </ScrollView>
        )}
      </Formik>
    </View>
  );
}
