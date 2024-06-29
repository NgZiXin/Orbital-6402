import { StyleSheet } from "react-native";
import { globalStyles } from "./global";

// common styles across form components and fragments
export const formStyles = StyleSheet.create({
  accountDetailsFormCommon: {
    marginBottom: 15,
  },

  workoutDetailsFormCommon: {
    marginBottom: 12,
    position: "relative",
    left: 9,
  },

  errorText: {
    ...globalStyles.label,
    color: "red",
  },

  sliderLabel: {
    flexDirection: "row",
    alignItems: "center",
  },

  slider: {
    width: "90%",
    height: 23,
    position: "relative",
    left: 5,
  },
});
