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
  // General
  rowContainer: {
    flexDirection: "row",
  },

  // Weight training table
  nameHeader: {
    ...commonStyles.commonHeaderStyles,
    flex: 3.4,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },

  weightHeader: {
    ...commonStyles.commonHeaderStyles,
    flex: 1.75,
    borderTopWidth: 0,
  },

  setsHeader: {
    ...commonStyles.commonHeaderStyles,
    flex: 1,
    borderTopWidth: 0,
  },

  repsHeader: {
    ...commonStyles.commonHeaderStyles,
    flex: 1,
    borderTopWidth: 0,
  },

  restsHeader: {
    ...commonStyles.commonHeaderStyles,
    flex: 1,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },

  nameCellWrapper: {
    ...commonStyles.commonCellStyles,
    flex: 3.4,
    flexDirection: "row",
    borderLeftWidth: 0,
  },

  weightCellWrapper: {
    ...commonStyles.commonCellStyles,
    flex: 1.75,
  },

  setsCellWrapper: {
    ...commonStyles.commonCellStyles,
    flex: 1,
  },

  repsCellWrapper: {
    ...commonStyles.commonCellStyles,
    flex: 1,
  },

  restsCellWrapper: {
    ...commonStyles.commonCellStyles,
    flex: 1,
    borderRightWidth: 0,
  },

  // Run Training Table
  weekHeader: {
    ...commonStyles.commonHeaderStyles,
    flex: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },

  detailHeader: {
    ...commonStyles.commonHeaderStyles,
    flexDirection: "row",
    padding: 0,
    flex: 8,
  },

  dayHeader: {
    ...commonStyles.commonHeaderStyles,
    flex: 1.5,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },

  descHeader: {
    ...commonStyles.commonHeaderStyles,
    flex: 2.5,
    borderTopWidth: 0,
  },

  distHeader: {
    ...commonStyles.commonHeaderStyles,
    flex: 1.25,
    borderTopWidth: 0,
  },

  zoneHeader: {
    ...commonStyles.commonHeaderStyles,
    flex: 1,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },

  weekCellWrapper: {
    ...commonStyles.commonCellStyles,
    flex: 1,
    borderLeftWidth: 0,
  },

  detailCellWrapper: {
    ...commonStyles.commonCellStyles,
    padding: 0,
    flex: 8,
  },

  dayCellWrapper: {
    ...commonStyles.commonCellStyles,
    flexDirection: "row",
    flex: 1.5,
    borderLeftWidth: 0,
  },

  descCellWrapper: {
    ...commonStyles.commonCellStyles,
    flex: 2.5,
  },

  distCellWrapper: {
    ...commonStyles.commonCellStyles,
    flex: 1.25,
  },

  zoneCellWrapper: {
    ...commonStyles.commonCellStyles,
    flex: 1,
    borderRightWidth: 0,
  },
});

export default tableStyles;
