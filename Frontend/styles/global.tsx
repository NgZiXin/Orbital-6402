import { StyleSheet } from "react-native";

// Common styles across all components
export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  header: {
    fontFamily: "inter-semibold",
    fontSize: 14,
    marginVertical: 8,
    lineHeight: 20,
  },

  para: {
    fontFamily: "inter-regular",
    fontSize: 12,
    marginVertical: 8,
    lineHeight: 20,
  },

  label: {
    fontFamily: "inter-regular",
    fontSize: 12,
  },

  // General styles for the custom text input
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 6,
    fontFamily: "inter-regular",
    fontSize: 12,
  },

  // For profile page only
  cardV1: {
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#F6F2F2",
    backgroundColor: "#fff",
    shadowColor: "#333",

    marginHorizontal: 4,
    marginVertical: 6,

    // Android only
    // Width: right offset, height: down offset
    elevation: 2.5,

    // Ios only
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },

  // For all other pages
  cardV2: {
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#F6F2F2",
    backgroundColor: "#fff",
    shadowColor: "#333",

    // Android only
    elevation: 2.5,

    // Ios only
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
});
