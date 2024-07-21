import { StyleSheet, View } from "react-native";
import { Formik } from "formik";
import SubmitButton from "../../general/submit";
import RadiusSlider from "../fragments/findNearestDetails/radius";
import SearchField from "../fragments/findNearestDetails/search";
import QueryButton from "../fragments/findNearestDetails/query";

interface FindNearestFormValues {
  radius: number;
  choice: string;
  location: string;
}

export default function FindNearestForm({
  setWebviewUri,
  setFindNearestModal,
}: any) {
  const handleSubmit = (values: FindNearestFormValues) => {
    // Display setWebView on Modal
    setWebviewUri(
      `${process.env.EXPO_PUBLIC_DOMAIN}services/?type=${values.choice}&address=${values.location}&radius=${values.radius}`
    );

    // Close Modal
    setFindNearestModal(false);
  };

  return (
    <>
      <Formik
        initialValues={{
          radius: 3,
          choice: "",
          location: "",
        }}
        // Optimization to minimize operations
        // Form just validates on blur and submit
        validateOnChange={false}
        onSubmit={handleSubmit}
      >
        {(formikProps) => (
          <View>
            <SearchField formikProps={formikProps} />
            <RadiusSlider formikProps={formikProps} />
            <QueryButton formikProps={formikProps} />
            <SubmitButton
              onPressHandler={formikProps.handleSubmit}
              text="Search"
              style={styles.submitButton}
            />
          </View>
        )}
      </Formik>
    </>
  );
}

const styles = StyleSheet.create({
  submitButton: {
    position: "relative",
    left: 9,
    width: "95%",
  },
});
