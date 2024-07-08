import { Text, View } from "react-native";
import { globalStyles } from "../../../../../styles/global";
import CustomTextInput from "@/components/general/customTextInput";
import { formStyles } from "@/styles/form";

export default function DistanceField({ formikProps }: any) {
  return (
    <>
      <View style={{ ...formStyles.workoutDetailsFormCommon, width: "95%"}}>
        <Text style={globalStyles.label}>Target Distance (in km):</Text>
        <CustomTextInput
          style={globalStyles.input}
          placeholder={formikProps.values.distance.toString()}
          onChangeText={formikProps.handleChange("distance")}
          value={formikProps.values.distance}
          keyboardType="distance"
        />
        {formikProps.errors.distance && (
          <Text style={formStyles.errorText}>
            {formikProps.errors.distance}
          </Text>
        )}
      </View>
    </>
  );
}
