import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { globalStyles } from "../../../styles/global";


type TextBoxProps = {
  message: string;
};

function getSmartBold(text: string) {
  // Split the text around **
  const arr = text.split("**");

  // Here we will store an array of Text components
  const newTextArr: any[] = [];

  // Loop over split text
  arr.forEach((element, index) => {
    // If its an odd element then it is inside **...** block
    if (index % 2 !== 0) {
      // Wrap with bold text style
      const newElement = <Text key={index}  style={styles.boldText}>{element}</Text>;
      newTextArr.push(newElement);
    } else {
      // Simple Text
      const newElement = <Text key={index}>{element}</Text>;
      newTextArr.push(newElement);
    }
  });
  return newTextArr;
}

export default function TextBox({ message }: TextBoxProps) {
    return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        <Text style={styles.header}>
          There was an error in getting a structured response from our AI. Here
          is our AI's unstructured response:
        </Text>
        <Text style={styles.message}>
          {getSmartBold(message)}
        </Text>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: 310,
    borderWidth: 2,
    borderColor: "#FFC4C4",
    marginTop: -19,
    padding: 10,
  },

  header: {
    ...globalStyles.para,
    color: "red",
  },

  message: {
    ...globalStyles.para,
    marginTop: 10,
  },

  boldText: {
    fontWeight: "bold", // Use fontWeight to make text bold
  },

});