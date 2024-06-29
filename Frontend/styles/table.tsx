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
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },

  weightHeader: {
    ...commonStyles.commonHeaderStyles,
    flex: 1,
    borderTopWidth: 0,
  },

  amountHeader: {
    ...commonStyles.commonHeaderStyles,
    flex: 1,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },

  rowContainer: {
    flexDirection: "row",
  },

  nameCellWrapper: {
    ...commonStyles.commonCellStyles,
    flex: 2.3,
    flexDirection: "row",
    borderLeftWidth: 0,
  },

  weightCellWrapper: {
    ...commonStyles.commonCellStyles,
    flex: 1,
  },

  amountCellWrapper: {
    ...commonStyles.commonCellStyles,
    flex: 1,
    borderRightWidth: 0,
  },
});

export default tableStyles;
