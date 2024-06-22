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
import {
  UsernameField,
  PasswordField,
  GenderField,
  HeightField,
  WeightField,
  BirthdayField,
  SubmitButton,
} from "../utility/formComponents/index";
// import { REACT_APP_DOMAIN } from '@env';

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
    <View style={globalStyles.container}>
      {/* This is to account for keyboard potentially blocking view of input fields*/}
      <KeyboardAvoidingView
        style={globalStyles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
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
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={handleSubmit}
          >
            {/* Function that generates the required JSX/TSX */}
            {(formikProps) => (
              <View>
                <Text style={globalStyles.header}>🧙 Welcome! 🧙</Text>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{ position: "relative", bottom: 10 }}
                >
                  <View style={{ position: "relative", bottom: 5 }}>
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
              </View>
            )}
          </Formik>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
