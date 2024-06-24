import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  FlatList,
  ScrollView,
  SectionList,
  View,
  Text,
  TouchableOpacity,
} from "react-native";

import sampleData from "./data";
import tableStyles from "@/styles/table";
import { globalStyles } from "@/styles/global";
import Ionicons from "@expo/vector-icons/Ionicons";
import ValidationModal from "@/components/modal/workoutPage/muscleGroup/validation";

export default function Table() {
  // use a memoized version so they don't keep rebuilding on every render
  const scrollableColumns = useMemo(() => ["Weight", "Reps", "Sets"], []);
  const fixedColumn = useMemo(() => ["Name"], []);

  const [tableData, setTableData] = useState([]);
  const [validationModal, setValidationModal] = useState<boolean>(false);
  const deleteIndex = useRef<number>(-1);

  useEffect(() => {
    setTableData(sampleData);
  }, []);

  const renderHeader = useCallback(
    (columns: string[], isFixedHeader: boolean) => (
      <View style={{ flexDirection: "row" }}>
        {columns.map((column: string, index: number) => (
          <View
            key={index}
            style={
              isFixedHeader ? tableStyles.nameHeader : tableStyles.otherHeader
            }
          >
            <Text
              style={{ ...globalStyles.label, fontFamily: "inter-semibold" }}
            >
              {column + " "}
            </Text>
          </View>
        ))}
      </View>
    ),
    [tableData]
  );

  function renderNameCol({ item, index }: any) {
    return (
      <View style={tableStyles.firstColCellWrapper}>
        <TouchableOpacity
          style={{ width: "10%" }}
          onPress={() => handlePress(index)}
        >
          <Ionicons
            name="close-outline"
            size={15}
            style={{ position: "relative", right: 5 }}
          />
        </TouchableOpacity>
        <Text style={{ ...globalStyles.label, width: "90%" }}>{item.name}</Text>
      </View>
    );
  }

  function renderOtherCols({ item }: any) {
    return (
      <View style={tableStyles.rowContainer}>
        <View style={tableStyles.otherColCellWrapper}>
          <Text style={globalStyles.label}>{item.weight}</Text>
        </View>

        <View style={tableStyles.otherColCellWrapper}>
          <Text style={globalStyles.label}>{item.reps}</Text>
        </View>

        <View style={tableStyles.otherColCellWrapper}>
          <Text style={globalStyles.label}>{item.sets}</Text>
        </View>
      </View>
    );
  }

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
    // Future TODO: better way to link both flatlists
    <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
      <View style={tableStyles.rowContainer}>
        <FlatList
          data={tableData}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index + ""}
          ListHeaderComponent={renderHeader(fixedColumn, true)}
          renderItem={renderNameCol}
        />

        <ScrollView
          style={{ flex: 1 }}
          showsHorizontalScrollIndicator={false}
          horizontal
        >
          <FlatList
            data={tableData}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index + ""}
            ListHeaderComponent={renderHeader(scrollableColumns, false)}
            renderItem={renderOtherCols}
          />
        </ScrollView>
      </View>
      {validationModal && (
        <ValidationModal
          setValidationModal={setValidationModal}
          topText="Delete Confirmation"
          bottomText="Are you sure you want to delete this exercise"
          handleDelete={handleDelete}
        />
      )}
    </ScrollView>
  );
}
