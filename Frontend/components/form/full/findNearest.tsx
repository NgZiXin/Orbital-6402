import { View } from "react-native";
import { Formik } from "formik";
import SubmitButton from "../../general/submit";

import RadiusSlider from "../fragments/findNearestDetails/radius";
import SearchField from "../fragments/findNearestDetails/search";
import QueryButton from "../fragments/findNearestDetails/query";

export default function FindNearestForm({
  setWebviewUri,
  setFindNearestModal,
}: any) {
  const handleSubmit = (values: any) => {
    // Display setWebView on Modal
    setWebviewUri(
      `${process.env.EXPO_PUBLIC_DOMAIN}services/?type=${values.query}&address=${values.search}&radius=${values.radius}`
    );

    // Close Modal
    setFindNearestModal(false);
  };

  return (
    <>
      <Formik
        initialValues={{
          search: "",
          query: "",
          radius: 3,
        }}
        validateOnChange={false}
        validateOnBlur={false}
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
              style={{ position: "relative", left: 9, width: "95%" }}
            />
          </View>
        )}
      </Formik>
    </>
  );
}
