// RenderChips.js
import { globalStyles } from "@/styles/global";
import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";

const numberToMuscleGroupMap: any = {
  "1": "Chest",
  "2": "Shoulders",
  "3": "Arms",
  "4": "Back",
  "5": "Core",
  "6": "Legs",
};

export default function CustomChips({
  selectedItems,
}: {
  selectedItems: string[];
}) {
  const filterItems = () => {
    const filterFunction = (item: string) => {
      if (item.length == 1) {
        return true;
      } else {
        return false;
      }
    };

    return selectedItems.filter(filterFunction).sort();
  };

  const processed = filterItems();

  return (
    <ScrollView
      style={
        {
          // height: 100,
          // borderColor: "#bbb",
          // borderWidth: 1,
          // borderRadius: 8,
        }
      }
      contentContainerStyle={styles.boxWrapper}
    >
      {/* {processed.length === 0 && (
        <Text style={globalStyles.para}>Nothing selected </Text>
      )} */}

      {processed.length > 0 &&
        processed.map((item: string, index: number) => (
          // Key should be something unique that can always identify each item
          <View style={{ marginBottom: 10 }}>
            <Text key={item} style={globalStyles.label}>
              {numberToMuscleGroupMap[item]}
            </Text>
          </View>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  boxWrapper: {
    // minHeight: 100,
    padding: 12,
    // In future
    // SO burnt out rn WTF
    //   flexDirection: "row",
    //   flexWrap: "wrap",
  },
});
