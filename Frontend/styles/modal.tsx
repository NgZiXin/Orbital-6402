import { StyleSheet } from "react-native";

// common styles across modal components
export const modalStyles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalContent: {
    backgroundColor: "white",
    padding: 15,
    width: "85%",
    height: "auto",
    borderRadius: 10,
  },

  icon: {
    paddingHorizontal: 15,
  },
});
