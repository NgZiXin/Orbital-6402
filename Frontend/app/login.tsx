import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";

import { globalStyles } from "../styles/global";
import { Formik, FormikHelpers } from "formik";
import { useNavigation } from "expo-router";
import { setItem } from "../utility/asyncStorage";
import {
  UsernameField,
  PasswordField,
  SubmitButton,
} from "../utility/formComponents/index";
// import { REACT_APP_DOMAIN } from '@env';

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
      const response = await fetch(`http://192.168.18.5:8000/accounts/login/`, {
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
    <View style={globalStyles.container}>
      {/* This is to account for keyboard potentially blocking view of input fields*/}
      <KeyboardAvoidingView
        style={globalStyles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
            <Formik
              style={{ flex: 1 }}
              initialValues={{ username: "", password: "" }}
              onSubmit={handleSubmit}
            >
              {/* Function that generates the required JSX/TSX */}
              {(formikProps) => (
                <View>
                  <Text style={globalStyles.header}>🧙 Welcome! 🧙</Text>
                  <ScrollView style={{ position: "relative", bottom: 15 }}>
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
    </View>
  );
}
