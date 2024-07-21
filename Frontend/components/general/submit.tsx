import { globalStyles } from "../../styles/global";
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface SubmitButtonProps {
  onPressHandler: () => void;
  text: string;
  style?: StyleProp<ViewStyle>;
}

// When multiple arguments are passed into the FC
// They are automatically packaged as an object
// We need to destructure/unpack this object and work with individiual properties
export default function SubmitButton({
  onPressHandler,
  text,
  style,
}: SubmitButtonProps) {
  return (
    <>
      <TouchableOpacity onPress={onPressHandler} style={[styles.submit, style]}>
        <Text style={styles.submitButtonText}>{text}</Text>
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

  submitButtonText: {
    ...globalStyles.header,
    textAlign: "center",
    fontSize: 12,
  },
});
