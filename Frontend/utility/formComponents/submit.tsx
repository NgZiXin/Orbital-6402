import { globalStyles } from "../../styles/global";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface SubmitButtonProps {
  onPressHandler: () => void;
  text: string;
}

// When multiple arguments are passed into the FC
// They are automatically packaged as an object
// We need to destructure/unpack this object and work with individiual properties
export default function SubmitButton({
  onPressHandler,
  text,
}: SubmitButtonProps) {
  return (
    <>
      <TouchableOpacity onPress={onPressHandler} style={styles.submit}>
        <Text
          style={{
            ...globalStyles.header,
            textAlign: "center",
            fontSize: 12,
          }}
        >
          {text}
        </Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  submit: {
    width: "100%",
    backgroundColor: "#F5BABA",
    borderRadius: 10,
    marginTop: 15,
  },
});
