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
import { WeightWorkoutData } from "@/app/(tabs)/workout";
import tableStyles from "@/styles/table";
import { globalStyles } from "@/styles/global";
import Ionicons from "@expo/vector-icons/Ionicons";
import ValidationModal from "@/components/modal/workoutPage/muscleGroup/validation";

type TableProps = {
  weightWorkoutData: WeightWorkoutData[];
  refresh: boolean;
};

export default function WeightTable({ weightWorkoutData, refresh }: TableProps) {
  // returns a memoized array value, that never changes
  // so don't need to keep rebuilding on every render
  const columns = useMemo(() => ["Name", "Weight", "Sets", "Reps", "Rest"], []);

  const [tableData, setTableData] = useState<WeightWorkoutData[]>(weightWorkoutData);
  const [validationModal, setValidationModal] = useState<boolean>(false);
  const deleteIndex = useRef<number>(-1);

  // For Refresh
  useEffect(() => {
    setTableData(weightWorkoutData);
  }, [refresh, weightWorkoutData]);

  // returns a memoized function object, that never changes
  // so don't need to keep rebuilding on every render
  const renderHeader = useCallback(
    (columns: string[]) => (
      <View style={{ flexDirection: "row" }}>
        {columns.map((column: string, index: number) => (
          <View
            key={index}
            style={
              index === 0
                ? tableStyles.nameHeader
                : index === 1
                ? tableStyles.weightHeader
                : index === 2
                ? tableStyles.setsHeader
                : index === 3
                ? tableStyles.repsHeader
                : tableStyles.restsHeader
            }
          >
            <Text
              style={[
                styles.headerLabel,
                index === 2 ? styles.headerExtra : undefined,
              ]}
            >
              {column + " "}
            </Text>
          </View>
        ))}
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
              tableStyles.nameCellWrapper,
              index === lastIndex ? styles.cellsExtra : undefined,
            ]}
          >
            <TouchableOpacity
              style={{ width: "10%" }}
              onPress={() => handlePress(index)}
            >
              <Ionicons
                name="close-outline"
                size={15}
                style={{ position: "relative", right: 7 }}
              />
            </TouchableOpacity>
            <Text style={{ ...globalStyles.label, width: "90%" }}>
              {item.name}
            </Text>
          </View>

          <View
            style={[
              tableStyles.weightCellWrapper,
              index === lastIndex ? styles.cellsExtra : undefined,
            ]}
          >
            <Text style={globalStyles.label}>{item.weight} kg</Text>
          </View>

          <View
            style={[
              tableStyles.setsCellWrapper,
              index === lastIndex ? styles.cellsExtra : undefined,
            ]}
          >
            <Text style={globalStyles.label}>{item.sets}</Text>
          </View>

          <View
            style={[
              tableStyles.repsCellWrapper,
              index === lastIndex ? styles.cellsExtra : undefined,
            ]}
          >
            <Text style={globalStyles.label}>{item.reps}</Text>
          </View>

          <View
            style={[
              tableStyles.restsCellWrapper,
              index === lastIndex ? styles.cellsExtra : undefined,
            ]}
          >
            <Text style={globalStyles.label}>{item.rests}s</Text>
          </View>
        </View>
      );
    },
    [tableData]
  );

  // no need to over-optimize for these two functions
  function handlePress(index: number) {
    deleteIndex.current = index;
    setValidationModal(true);
  }

  function handleDelete() {
    setTableData((prevTableData) =>
      prevTableData.filter((_, i) => i !== deleteIndex.current)
    );
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

  headerExtra: {
    position: "relative",
    left: 2.5,
  },

  cellsExtra: {
    borderBottomWidth: 0,
  },
});
