import { StyleSheet } from "react-native";

// common styles across all components
export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  titleText: {
    fontFamily: "inter-bold",
    fontSize: 18,
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

  // label for form fields
  label: {
    fontFamily: "inter-regular",
    fontSize: 12,

    // position: "relative",
    // top: 0,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 6,
    fontFamily: "inter-regular",
    fontSize: 12,

    // position: "relative",
    // bottom: 0,
  },

  // mostly for profile page
  cardV1: {
    borderRadius: 7,
    elevation: 3,
    backgroundColor: "#fff",
    // width: right offset, height: down offset
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 4,
    marginVertical: 6,
  },

  // generally for all other pages
  cardV2: {
    borderRadius: 7,
    elevation: 3,
    backgroundColor: "#fff",
    shadowOffset: { width: 0, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    // very slight horizontal margin
    // preserving the shadow card effect and also somewhat preserving alignment
    marginHorizontal: "0.15%",
  },
});
