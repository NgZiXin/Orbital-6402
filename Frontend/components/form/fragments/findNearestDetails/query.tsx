import { globalStyles } from "../../../../styles/global";
import { Text, View, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { formStyles } from "@/styles/form";

export default function QueryButton({ formikProps }: any) {
  return (
    <View style={formStyles.findNearestDetailsFormCommon}>
      <Text style={globalStyles.label}>Select Gym or Park: </Text>
      <View style={formStyles.buttonsWrapper}>
        <TouchableOpacity
          onPress={() => formikProps.setFieldValue("query", "gym")}
          style={[
            formStyles.button,
            formikProps.values.query == "gym"
              ? formStyles.highlightedButton
              : undefined,
          ]}
        >
          <Text
            style={{
              ...globalStyles.para,
              position: "relative",
              right: 3,
            }}
          >
            Gym
          </Text>
          <MaterialIcons
            name="sports-gymnastics"
            size={20}
            style={{
              position: "relative",
              left: 2,
              top: 10,
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => formikProps.setFieldValue("query", "park")}
          style={[
            formStyles.button,
            { marginLeft: 10 },
            formikProps.values.query == "park"
              ? formStyles.highlightedButton
              : undefined,
          ]}
        >
          <Text style={globalStyles.para}>Park</Text>
          <MaterialCommunityIcons
            name="tree-outline"
            size={20}
            style={{
              position: "relative",
              left: 5,
              top: 10,
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
