import React from "react";
import {
  Keyboard,
  ScrollView,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import { globalStyles } from "../styles/global";
import { Formik, FormikHelpers } from "formik";
import { getItem } from "../utility/asyncStorage";

import {
  UsernameField,
  PasswordField,
  GenderField,
  HeightField,
  WeightField,
  BirthdayField,
  SubmitButton,
} from "../utility/formComponents/index";

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

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // Handle successful signup (close the edit modal)
    actions.resetForm();
    submitHandler();
  };

  return (
    <View style={globalStyles.container}>
      <View style={{ flex: 1 }}>
        <Formik
          style={{ flex: 1 }}
          initialValues={{
            username: "",
            password: "",
            height: "",
            weight: "",
            birthday: new Date(),
            gender: "",
          }}
          // optimizations
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={handleSubmit}
        >
          {/* Function that generates the required JSX/TSX */}
          {(formikProps) => (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View>
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
              </View>
            </ScrollView>
          )}
        </Formik>
      </View>
    </View>
  );
}
