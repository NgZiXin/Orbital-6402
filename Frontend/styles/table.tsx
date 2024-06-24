import { StyleSheet } from "react-native";

const commonStyles = StyleSheet.create({
  commonHeaderStyles: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D9D9D9",
    backgroundColor: "dsdd",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  commonCellStyles: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#D9D9D9",
  },
});

const tableStyles = StyleSheet.create({
  nameHeader: {
    ...commonStyles.commonHeaderStyles,
  },

  otherHeader: {
    ...commonStyles.commonHeaderStyles,
    width: 90,
  },

  container: {
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "center",
    padding: 16,
    width: "100%",
  },

  tableHeader: {
    alignItems: "center",
    flexDirection: "row",
  },

  rowContainer: {
    flexDirection: "row",
  },

  firstColCellWrapper: {
    ...commonStyles.commonCellStyles,
    height: 80,
    flexDirection: "row",
  },

  otherColCellWrapper: {
    ...commonStyles.commonCellStyles,
    width: 90,
    height: 80,
  },
});

export default tableStyles;
