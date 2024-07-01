import { Text } from "react-native";
import { globalStyles } from "@/styles/global";

const initialSkeleton = [
  {
    label: "Mon",
    value: 5.0,
    topLabelComponent: () => <Text style={globalStyles.label}>5.0</Text>,
    onPress: () => console.log("todo"),
  },
  {
    label: "Tues",
    value: 2.0,
    topLabelComponent: () => <Text style={globalStyles.label}>2.0</Text>,
    onPress: () => console.log("todo"),
  },
  {
    label: "Wed",
    value: 2.5,
    topLabelComponent: () => <Text style={globalStyles.label}>2.5</Text>,
    onPress: () => console.log("todo"),
  },
  {
    label: "Thurs",
    value: 10.0,
    topLabelComponent: () => <Text style={globalStyles.label}>10.0</Text>,
    onPress: () => console.log("todo"),
  },
  {
    label: "Fri",
    value: 3.0,
    topLabelComponent: () => <Text style={globalStyles.label}>3.0</Text>,
    onPress: () => console.log("todo"),
  },
  {
    label: "Sat",
    value: 4.0,
    topLabelComponent: () => <Text style={globalStyles.label}>4.0</Text>,
    onPress: () => console.log("todo"),
  },
  {
    label: "Sun",
    value: 5.0,
    topLabelComponent: () => <Text style={globalStyles.label}>5.0</Text>,
    onPress: () => console.log("todo"),
  },
];

export default initialSkeleton;
