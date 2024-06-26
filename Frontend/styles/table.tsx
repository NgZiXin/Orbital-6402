import { StyleSheet } from "react-native";

const commonStyles = StyleSheet.create({
  commonHeaderStyles: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D9D9D9",
    backgroundColor: "#F6F2F2",
    padding: 8,
  },

  commonCellStyles: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    height: "auto",
  },
});

const tableStyles = StyleSheet.create({
  nameHeader: {
    ...commonStyles.commonHeaderStyles,
    flex: 2.3,
  },

  otherHeader: {
    ...commonStyles.commonHeaderStyles,
    flex: 1,
  },

  rowContainer: {
    flexDirection: "row",
  },

  firstCellWrapper: {
    ...commonStyles.commonCellStyles,
    flex: 2.3,
    flexDirection: "row",
  },

  otherCellWrapper: {
    ...commonStyles.commonCellStyles,
    flex: 1,
  },
});

export default tableStyles;
