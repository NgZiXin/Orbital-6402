import { globalStyles } from "../../styles/global";
import { Ionicons } from "@expo/vector-icons";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface SubmitButtonProps {
  onPressHandler: () => void | Promise<void>;
  text?: string;
  icon?: [
    iconName: keyof typeof Ionicons.glyphMap,
    iconSize: number,
    iconStyle: StyleProp<ViewStyle>
  ];
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

// When arguments are passed into the FC
// They are automatically packaged as an object
// We need to destructure/unpack this object and work with individiual properties
export default function SubmitButton({
  onPressHandler,
  text,
  icon,
  style,
  textStyle,
}: SubmitButtonProps) {
  return (
    <>
      <TouchableOpacity onPress={onPressHandler} style={[styles.submit, style]}>
        {text && <Text style={[styles.text, textStyle]}>{text}</Text>}
        {icon && <Ionicons name={icon[0]} size={icon[1]} style={icon[2]} />}
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  submit: {
    backgroundColor: "#FFC4C4",
    borderRadius: 10,
    marginTop: 17,
  },

  text: {
    ...globalStyles.header,
    textAlign: "center",
    fontSize: 12,
  },
});
