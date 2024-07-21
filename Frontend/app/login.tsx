import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { globalStyles } from "../styles/global";
import { Formik, FormikHelpers } from "formik";
import { useNavigation } from "expo-router";
import { setToken } from "../utility/userToken";
import { useLoading } from "@/hooks/useLoading";

import UsernameField from "@/components/form/fragments/accountDetails/username";
import PasswordField from "@/components/form/fragments/accountDetails/password";
import SubmitButton from "@/components/general/submit";
import loginValidationSchema from "@/components/form/validationSchema/login";

interface ErrorResponse {
  non_field_errors: string[];
}

interface SuccessResponse {
  token: string;
}

interface LoginValues {
  username: string;
  password: string;
}

export default function Login() {
  const navigation: any = useNavigation();
  const { showLoading, hideLoading } = useLoading();

  const handleSubmit = async (
    values: LoginValues,
    actions: FormikHelpers<LoginValues>
  ): Promise<void> => {
    try {
      showLoading();

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_DOMAIN}accounts/login/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      // Case where backend raises an error
      if (!response.ok) {
        const errorResponse: ErrorResponse = await response.json();

        if (errorResponse.non_field_errors) {
          Alert.alert("Login Failed", "Incorrect user credentials provided");
          return;
        } else {
          Alert.alert("Login Failed", "Network error, please try again");
          return;
        }
      }

      // Extract the token string from the response
      const data: SuccessResponse = await response.json();
      const token: string = data["token"];

      // Stores the token string under async storage
      /*
          Async storage supports key-value pair entries 
          Key: "token" (always)
          Value: Token string associated with a particular user 
        */
      setToken("token", token);

      // Handle successful login (navigate to profile page)
      actions.resetForm();
      navigation.navigate("(tabs)");

      // Catches any errors
    } catch (error: any) {
      console.error(error.message);
    } finally {
      hideLoading();
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        style={styles.mainContainer}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Formik
            initialValues={{ username: "", password: "" }}
            validationSchema={loginValidationSchema}
            // Optimization to minimize operations
            // Form just validates on blur and submit
            validateOnChange={false}
            onSubmit={handleSubmit}
          >
            {/* Function that generates the form */}
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
                    onPressHandler={() => {
                      formikProps.resetForm();
                      navigation.navigate("sign-up");
                    }}
                    text="Sign Up"
                  />
                </ScrollView>
              </View>
            )}
          </Formik>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    ...globalStyles.container,
    padding: 20,
    justifyContent: "center",
  },
});
