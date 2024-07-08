import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  FlatList,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { RunWorkoutData, RunWorkoutDetailData } from "@/app/(tabs)/workout";
import tableStyles from "@/styles/table";
import { globalStyles } from "@/styles/global";
import Ionicons from "@expo/vector-icons/Ionicons";
import ValidationModal from "@/components/modal/workoutPage/muscleGroup/validation";

type TableProps = {
  runWorkoutData: RunWorkoutData[];
  refresh: boolean;
};

export default function RunTable({ runWorkoutData, refresh }: TableProps) {
  // Helper for deep copying array
  const deepCopyArr = (arr: any[]) => JSON.parse(JSON.stringify(arr));

  // returns a memoized array value, that never changes
  // so don't need to keep rebuilding on every render
  const columns = useMemo(() => ["Week", "Day", "Desc", "Dist", "Zone"], []);

  const [tableData, setTableData] = useState<RunWorkoutData[]>([]);
  const [validationModal, setValidationModal] = useState<boolean>(false);
  const deleteIndex = useRef<[number, number]>([-1, -1]); // [parent index, curr index]

  // For Refresh
  useEffect(() => {
    setTableData(deepCopyArr(runWorkoutData)); // Need to deep copy because mutating data
  }, [refresh, runWorkoutData]);

  // returns a memoized function object, that never changes
  // so don't need to keep rebuilding on every render
  const renderHeader = useCallback(
    (columns: string[]) => (
      <View style={{ flexDirection: "row" }}>
        <View style={tableStyles.weekHeader}>
          <Text style={styles.headerLabel}>{columns[0] + " "}</Text>
        </View>
        <View style={tableStyles.detailHeader}>
          {columns.slice(1).map((column: string, index: number) => (
            <View
              key={index}
              style={
                index === 0
                  ? tableStyles.dayHeader
                  : index === 1
                  ? tableStyles.descHeader
                  : index === 2
                  ? tableStyles.distHeader
                  : tableStyles.zoneHeader
              }
            >
              <Text style={styles.headerLabel}>{column + " "}</Text>
            </View>
          ))}
        </View>
      </View>
    ),
    []
  );

  // same idea
  const renderRows = useCallback(
    ({ item, index }: any) => {
      const lastIndex: number = tableData.length - 1;
      return (
        <View style={tableStyles.rowContainer}>
          <View
            style={[
              tableStyles.weekCellWrapper,
              index === lastIndex ? styles.cellsExtra : undefined,
            ]}
          >
            <Text style={{ ...globalStyles.label }}>{item.week}</Text>
          </View>

          <View
            style={[
              tableStyles.detailCellWrapper,
              index === lastIndex ? styles.cellsExtra : undefined,
            ]}
          >
            <FlatList
              data={item.detail}
              renderItem={({ item: subItem, index: subIndex }) => (
                <SubRows parentIndex={index} item={subItem} index={subIndex} />
              )}
            />
          </View>
        </View>
      );
    },
    [tableData]
  );

  // Sub Rows (No Callback because already nested within call back)
  const SubRows = ({ parentIndex, item, index }: any) => {
    const lastIndex: number = tableData[parentIndex].detail.length - 1;
    return (
      <View style={tableStyles.rowContainer}>
        <View
          style={[
            tableStyles.dayCellWrapper,
            index == 0 ? styles.cellsTop : undefined,
            index == lastIndex ? styles.cellsExtra : undefined,
          ]}
        >
          <TouchableOpacity
            style={{ width: "40%" }}
            onPress={() => handlePress(parentIndex, index)}
          >
            <Ionicons
              name="close-outline"
              size={15}
              style={{ position: "relative", right: 7 }}
            />
          </TouchableOpacity>
          <Text style={{ ...globalStyles.label, width: "60%" }}>
            {item.day}
          </Text>
        </View>

        <View
          style={[
            tableStyles.descCellWrapper,
            index == 0 ? styles.cellsTop : undefined,
            index == lastIndex ? styles.cellsExtra : undefined,
          ]}
        >
          <Text style={globalStyles.label}>{item.desc}</Text>
        </View>

        <View
          style={[
            tableStyles.distCellWrapper,
            index == 0 ? styles.cellsTop : undefined,
            index == lastIndex ? styles.cellsExtra : undefined,
          ]}
        >
          <Text style={globalStyles.label}>{item.dist}km</Text>
        </View>

        <View
          style={[
            tableStyles.zoneCellWrapper,
            index == 0 ? styles.cellsTop : undefined,
            index == lastIndex ? styles.cellsExtra : undefined,
          ]}
        >
          <Text style={globalStyles.label}>{item.zone}</Text>
        </View>
      </View>
    );
  };

  // no need to over-optimize for these two functions
  function handlePress(parentIndex: number, index: number) {
    deleteIndex.current = [parentIndex, index];
    setValidationModal(true);
  }

  function handleDelete() {
    setTableData((prevTableData) => {
      const newDetailData = prevTableData[deleteIndex.current[0]].detail.filter(
        (_, i) => i !== deleteIndex.current[1]
      );
      prevTableData[deleteIndex.current[0]].detail = newDetailData;
      return prevTableData;
    });
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.tableWrapper}>
        <FlatList
          data={tableData}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderHeader(columns)}
          renderItem={renderRows}
        />

        {validationModal && (
          <ValidationModal
            setValidationModal={setValidationModal}
            topText="Delete Confirmation"
            bottomText="Are you sure you want to delete this exercise"
            handleDelete={handleDelete}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tableWrapper: {
    maxHeight: 310,
    borderWidth: 2,
    borderColor: "#FFC4C4",
    marginTop: -19,
  },

  headerLabel: {
    ...globalStyles.label,
    fontFamily: "inter-semibold",
  },

  cellsExtra: {
    borderBottomWidth: 0,
  },

  cellsTop: {
    borderTopWidth: 0,
  },
});
