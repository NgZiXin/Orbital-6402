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

  findNearestDetailsFormCommon: {
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

  buttonsWrapper: {
    flexDirection: "row",
  },

  button: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#F6F2F2",
    borderRadius: 10,
    flex: 1,
  },

  highlightedButton: {
    borderColor: "red",
    borderWidth: 1,
  },
});
