import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
  ScrollView,
} from "react-native";

import { globalStyles } from "../styles/global";
import { Formik, FormikHelpers } from "formik";
import { useNavigation } from "expo-router";

import UsernameField from "@/components/form/fragments/accountDetails/username";
import PasswordField from "@/components/form/fragments/accountDetails/password";
import GenderField from "@/components/form/fragments/accountDetails/gender";
import HeightField from "@/components/form/fragments/accountDetails/height";
import WeightField from "@/components/form/fragments/accountDetails/weight";
import BirthdayField from "@/components/form/fragments/accountDetails/birthday";
import SubmitButton from "@/components/general/submit";

export default function SignUp() {
  const navigation: any = useNavigation();

  interface SignUpValues {
    username: string;
    password: string;
    height: string;
    weight: string;
    birthday: Date;
    gender: string;
  }

  const handleSubmit = async (
    values: SignUpValues,
    actions: FormikHelpers<SignUpValues>
  ) => {
    try {
      console.log(values.birthday);
      // Custom serialization
      const body = {
        ...values,
        birthday: values.birthday.toISOString().split("T")[0], // Convert date to 'YYYY-MM-DD' format
      };

      const ip = process.env.EXPO_PUBLIC_DOMAIN;
      const response = await fetch(`http://${ip}:8000/accounts/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        console.log(body);
        console.log(response);
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      // Handle successful signup (navigate to login screen)
      actions.resetForm();
      navigation.navigate("login");
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      Alert.alert(
        "Signup Failed",
        "Please check your information and try again."
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View
        style={{
          flex: 1,
          padding: 20,
          justifyContent: "center",
        }}
      >
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
            <View>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={globalStyles.header}>🧙 Welcome! 🧙</Text>

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
                <SubmitButton
                  onPressHandler={() => navigation.navigate("login")}
                  text="Go Back"
                />
              </ScrollView>
            </View>
          )}
        </Formik>
      </View>
    </KeyboardAvoidingView>
  );
}
