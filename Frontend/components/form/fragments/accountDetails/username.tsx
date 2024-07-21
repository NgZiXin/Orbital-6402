import { globalStyles } from "../../../../styles/global";
import { Text, View } from "react-native";
import CustomTextInput from "@/components/general/customTextInput";
import { formStyles } from "@/styles/form";

export default function UsernameField({ formikProps }: any) {
  return (
    <>
      <View style={formStyles.accountDetailsFormCommon}>
        <Text style={globalStyles.label}>Name:</Text>
        <CustomTextInput
          style={globalStyles.input}
          placeholder="John Cena"
          onChangeText={formikProps.handleChange("username")}
          value={formikProps.values.username}
          // When we click away, run the validation schema on username field
          onBlur={formikProps.handleBlur("username")}
        />

        {/* 
          If there is an error and field has been visited
          Visited: Click into --> click away 
          Display that error
        */}
        {formikProps.errors.username && formikProps.touched.username && (
          <Text style={formStyles.errorText}>
            {formikProps.errors.username}
          </Text>
        )}
      </View>
    </>
  );
}
