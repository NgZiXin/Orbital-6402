import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { globalStyles } from "../styles/global";
import { Formik, FormikHelpers } from "formik";
import { useRouter } from "expo-router";
import { useLoading } from "@/hooks/useLoading";
import { setToken } from "../utility/general/userToken";

import UsernameField from "@/components/form/fragments/accountFields/username";
import PasswordField from "@/components/form/fragments/accountFields/password";
import GenderField from "@/components/form/fragments/accountFields/gender";
import HeightField from "@/components/form/fragments/accountFields/height";
import WeightField from "@/components/form/fragments/accountFields/weight";
import BirthdayField from "@/components/form/fragments/accountFields/birthday";
import SubmitButton from "@/components/general/submit";
import signupAndEditValidationSchema from "@/components/form/validationSchema/signupAndEdit";

interface ErrorResponse {
  username: string[];
}

interface SuccessResponse {
  token: string;
}

interface SignUpValues {
  username: string;
  password: string;
  gender: string;
  birthday: Date;
  height: string;
  weight: string;
}

export default function SignUp() {
  const router: any = useRouter();
  const { showLoading, hideLoading } = useLoading();

  const handleSubmit = async (
    values: SignUpValues,
    actions: FormikHelpers<SignUpValues>
  ): Promise<void> => {
    try {
      showLoading();

      // Custom serialization
      const body = {
        ...values,
        // Convert date to 'YYYY-MM-DD' format
        // To match database expected format
        birthday: values.birthday.toISOString().split("T")[0],
      };

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_DOMAIN}accounts/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      // Backend raises an error
      if (!response.ok) {
        const errorResponse: ErrorResponse = await response.json();
        if (errorResponse.username) {
          Alert.alert("Signup Failed", "That username already exists");
          return;
        } else {
          Alert.alert("Signup Failed", "Network error, please try again");
          return;
        }
      }

      // Extract the token string from the response
      const data: SuccessResponse = await response.json();
      const token: string = data["token"];
      setToken("token", token);

      // Handle successful signup (navigate to profile page)
      actions.resetForm();
      router.replace("/profile");

      // Catch other errors
    } catch (error: any) {
      const errorMessage = error.message;
      if (errorMessage.includes("similar")) {
        Alert.alert("Signup Failed", "Password is too similar to the username");
      } else if (errorMessage.includes("commonly used")) {
        Alert.alert(
          "Signup Failed",
          "Password cannot be a commonly used password"
        );
      } else {
        Alert.alert("Signup Failed", "Please try again");
      }
    } finally {
      hideLoading();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.mainContainer}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Formik
        initialValues={{
          username: "",
          password: "",
          gender: "",
          birthday: new Date(),
          height: "",
          weight: "",
        }}
        validationSchema={signupAndEditValidationSchema}
        // Optimization to minimize operations
        // Form just validates on blur and submit
        validateOnChange={false}
        onSubmit={handleSubmit}
      >
        {(formikProps) => (
          <View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={globalStyles.header}>🧙 Welcome! 🧙</Text>

              <UsernameField formikProps={formikProps} />
              <PasswordField formikProps={formikProps} />
              <GenderField formikProps={formikProps} />
              <BirthdayField formikProps={formikProps} />
              <HeightField formikProps={formikProps} />
              <WeightField formikProps={formikProps} />

              <SubmitButton
                onPressHandler={() => formikProps.handleSubmit()}
                text="Create Account"
              />
              <SubmitButton
                onPressHandler={() => {
                  formikProps.resetForm();
                  router.replace("/login");
                }}
                text="Log In"
              />
            </ScrollView>
          </View>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    ...globalStyles.container,
    padding: 20,
    justifyContent: "center",
  },
});
