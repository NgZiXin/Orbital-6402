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
import { useLoading } from "@/hooks/useLoading";
import { setItem } from "../components/general/asyncStorage";

import UsernameField from "@/components/form/fragments/accountDetails/username";
import PasswordField from "@/components/form/fragments/accountDetails/password";
import GenderField from "@/components/form/fragments/accountDetails/gender";
import HeightField from "@/components/form/fragments/accountDetails/height";
import WeightField from "@/components/form/fragments/accountDetails/weight";
import BirthdayField from "@/components/form/fragments/accountDetails/birthday";
import SubmitButton from "@/components/general/submit";
import signupAndEditValidationSchema from "@/components/form/validationSchema/signupAndEdit";

interface ErrorResponse {
  username: string[];
}

interface SignUpValues {
  username: string;
  password: string;
  height: string;
  weight: string;
  birthday: Date;
  gender: string;
}

interface SuccessResponse {
  token: string;
}

export default function SignUp() {
  const navigation: any = useNavigation();
  const { showLoading, hideLoading } = useLoading();

  const handleSubmit = async (
    values: SignUpValues,
    actions: FormikHelpers<SignUpValues>
  ): Promise<void> => {
    try {
      // Loading
      showLoading();

      try {
        // Custom serialization
        const body = {
          ...values,
          birthday: values.birthday.toISOString().split("T")[0], // Convert date to 'YYYY-MM-DD' format
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

        // Case where backend raises an error
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

        
        const data: SuccessResponse = await response.json();
        const token: string = data["token"];

        // stores the user (session-based) token string
        setItem("token", token);

        // Handle successful login (navigate to profile page)
        actions.resetForm();
        navigation.navigate("(tabs)");
      } catch (error: any) {
        const errorMessage = error.message;
        if (errorMessage.includes("similar")) {
          Alert.alert(
            "Signup Failed",
            "Password is too similar to the username"
          );
        } else if (errorMessage.includes("commonly used")) {
          Alert.alert(
            "Signup Failed",
            "Password cannot be a commonly used password"
          );
        } else {
          Alert.alert("Signup Failed", "Please try again");
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      hideLoading(); // Hide loading spinner after fetch completes
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
          validationSchema={signupAndEditValidationSchema}
          validateOnChange={false}
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
                  onPressHandler={() => {
                    formikProps.resetForm();
                    navigation.navigate("login");
                  }}
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
