import { ScrollView, StyleSheet } from "react-native";
import { Formik } from "formik";
import SubmitButton from "../../general/submit";
import SearchRadiusField from "../fragments/findNearestDetails/radius";
import ChoiceField from "../fragments/findNearestDetails/choice";
import LocationField from "../fragments/findNearestDetails/location";
import findNearestValidationSchema from "../validationSchema/findNearest";

interface FindNearestFormValues {
  radius: number;
  choice: string;
  location: string;
}

interface FindNearestFormProps {
  router: any;
  setFindNearestModal: (value: boolean) => void;
}

export default function FindNearestForm({
  router,
  setFindNearestModal,
}: FindNearestFormProps) {
  const handleSubmit = (values: FindNearestFormValues) => {
    // Construct the uri for the webview
    const constructedUri = `${process.env.EXPO_PUBLIC_DOMAIN}services/?type=${values.choice}&address=${values.location}&radius=${values.radius}`;

    // Close the modal
    // Push to the new page to display the webview
    setFindNearestModal(false);
    router.push({
      pathname: "nearestGymPark",
      // Passing params to another screen using expo router
      // Reference: https://stackoverflow.com/questions/77747019/how-can-i-pass-parameters-using-expo-router
      params: {
        uri: constructedUri,
      },
    });
  };

  return (
    <>
      <Formik
        initialValues={{
          radius: 3,
          choice: "",
          location: "",
        }}
        validationSchema={findNearestValidationSchema}
        // Optimization to minimize operations
        // Form just validates on blur and submit
        validateOnChange={false}
        onSubmit={handleSubmit}
      >
        {(formikProps) => (
          // ScrollView seems to include the keyboard.dismiss feature
          // Thats why its being used here instead of normal view
          <ScrollView showsVerticalScrollIndicator={false}>
            <SearchRadiusField formikProps={formikProps} />
            <ChoiceField formikProps={formikProps} />
            <LocationField formikProps={formikProps} />
            <SubmitButton
              onPressHandler={formikProps.handleSubmit}
              text="Search"
              style={styles.submitButton}
            />
          </ScrollView>
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
