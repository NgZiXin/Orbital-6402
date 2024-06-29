import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { globalStyles } from "../styles/global";
import { Formik, FormikHelpers } from "formik";
import { useNavigation } from "expo-router";
import { setItem } from "../components/general/asyncStorage";

import UsernameField from "@/components/form/fragments/accountDetails/username";
import PasswordField from "@/components/form/fragments/accountDetails/password";
import SubmitButton from "@/components/general/submit";

export default function Login() {
  const navigation: any = useNavigation();

  interface LoginValues {
    username: string;
    password: string;
  }

  const handleSubmit = async (
    values: LoginValues,
    actions: FormikHelpers<LoginValues>
  ) => {
    try {
      const ip = process.env.EXPO_PUBLIC_DOMAIN;
      const response = await fetch(`${process.env.EXPO_PUBLIC_DOMAIN}/accounts/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const token: string = data["token"];

      // stores the user (session-based) token string
      setItem("token", token);

      // Handle successful login (navigate to profile page)
      actions.resetForm();
      navigation.navigate("(tabs)");
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      Alert.alert(
        "Login Failed",
        "Please check your information and try again."
      );
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        style={globalStyles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{
              flex: 1,
              padding: 20,
              justifyContent: "center",
            }}
          >
            <Formik
              initialValues={{ username: "", password: "" }}
              // optimizations
              validateOnChange={false}
              validateOnBlur={false}
              onSubmit={handleSubmit}
            >
              {/* Function that generates the form*/}
              {(formikProps) => (
                <View>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={globalStyles.header}>🧙 Welcome! 🧙</Text>

                    <UsernameField formikProps={formikProps} />
                    <PasswordField formikProps={formikProps} />

                    <SubmitButton
                      onPressHandler={() => formikProps.handleSubmit()}
                      text="Log In"
                    />
                    <SubmitButton
                      onPressHandler={() => navigation.navigate("sign-up")}
                      text="Sign Up"
                    />
                  </ScrollView>
                </View>
              )}
            </Formik>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
}
