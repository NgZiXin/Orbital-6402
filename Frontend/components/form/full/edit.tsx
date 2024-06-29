import React from "react";
import { ScrollView, View } from "react-native";
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

export default function EditForm({ submitHandler }: any) {
  interface EditValues {
    username: string;
    password: string;
    height: string;
    weight: string;
    birthday: Date;
    gender: string;
  }

  const handleSubmit = async (
    values: EditValues,
    actions: FormikHelpers<EditValues>
  ) => {
    // Custom serialization
    const body = {
      ...values,
      birthday: values.birthday.toISOString().split("T")[0], // Convert date to 'YYYY-MM-DD' format
    };

    const token: string | null = await getItem("token");
    const ip = process.env.EXPO_PUBLIC_DOMAIN;
    const response = await fetch(`${process.env.EXPO_PUBLIC_DOMAIN}/accounts/data/`, {
      // put request to update existing user details
      // of the current user logged in
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // Handle successful signup (close the edit modal)
    actions.resetForm();
    submitHandler();
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
