import {
  LayoutChangeEvent,
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  Text,
  TextInputSelectionChangeEventData,
  TouchableOpacity,
  View,
} from "react-native";
import CustomTextInput from "./customTextInput";
import { globalStyles } from "@/styles/global";
import { useState, MutableRefObject } from "react";
import { ViewStyle } from "react-native/types";

interface TimeInputProps {
  title: string;
  additionalStyles?: StyleProp<ViewStyle>;
  startTime?: MutableRefObject<string[]>;
  endTime?: MutableRefObject<string[]>;
  notTwoDigits: MutableRefObject<boolean>;
}

interface Position {
  start?: number;
  end?: number;
}

function containsNonNumbers(value: string): boolean {
  // Regular expression to match any character that is not a digit
  const regex = /[^0-9]/;
  return regex.test(value);
}

export default function TimeInput({
  title,
  additionalStyles,
  startTime,
  endTime,
  notTwoDigits,
}: TimeInputProps) {
  const [timePeriod, setTimePeriod] = useState<string>(
    title == "Start time" ? "AM" : "PM"
  );

  const [cursorPosition, setCursorPosition] = useState<Position | null>(null);
  const [hour, setHour] = useState<string>("");
  const [minute, setMinute] = useState<string>("");
  const [hourErrorText, setHourErrorText] = useState<string>("");
  const [minuteErrorText, setMinuteErrorText] = useState<string>("");

  const firstPlaceholder: string = title == "Start time" ? "08" : "10";

  if (
    hour.length == 1 ||
    (minute.length == 1 && !hourErrorText && !minuteErrorText)
  ) {
    notTwoDigits.current = true;
  }

  // During a "correct" render:
  // startTime and endTime are ref variables
  // To prevent infinite loop!
  if (
    hour.length == 2 &&
    minute.length == 2 &&
    !hourErrorText &&
    !minuteErrorText
  ) {
    const fullTime: string[] = [hour, minute, timePeriod];
    notTwoDigits.current = false;
    // Propogate back the fullTime value
    // That has passed the first round of checks
    if (startTime) {
      startTime.current = fullTime;
    } else {
      // @ts-ignore
      endTime.current = fullTime;
    }
  }

  const handleLayout = (event: LayoutChangeEvent): void => {
    event.persist(); // Persist the event
    const { width } = event.nativeEvent.layout;

    // Only if its null
    // Then we set the state variable, minimizing re-renders
    if (cursorPosition === null) {
      const middle = Math.ceil(width / 2);
      setCursorPosition({ start: middle, end: middle });
    }
  };

  // Keep updating cursor position to new cursor position (after new input)
  // That this function receives
  const handleSelectionChange = (
    event: NativeSyntheticEvent<TextInputSelectionChangeEventData>
  ): void => {
    const { selection } = event.nativeEvent;
    setCursorPosition(selection);
  };

  const testValue = (value: string, type: string): void => {
    const setStateFunction =
      type === "Hours" ? setHourErrorText : setMinuteErrorText;

    const lowerBound = type === "Hours" ? 1 : 0;
    const upperBound = type === "Hours" ? 12 : 59;

    if (containsNonNumbers(value)) {
      setStateFunction(type + " must be a number");
    } else {
      const parsedValue: number = parseInt(value);
      if (parsedValue < lowerBound || parsedValue > upperBound) {
        setStateFunction(
          `${type} must be between ${lowerBound} - ${upperBound}`
        );
      }
    }
  };

  const handleHourChange = (value: string): void => {
    setHour(value);

    if (value.length == 2 && !minuteErrorText) {
      testValue(value, "Hours");
    } else {
      // Since we are either deleting the hour value
      // Or hiding the hour error
      setHourErrorText("");

      // If we are deleting the hour value
      // We need to test minute value to expose error (if any)
      testValue(minute, "Minutes");
    }
  };

  const handleMinuteChange = (value: string): void => {
    setMinute(value);

    if (value.length == 2 && !hourErrorText) {
      testValue(value, "Minutes");
    } else {
      // Since we are either deleting the minute value
      // Or hiding the minute error
      setMinuteErrorText("");

      // If we are deleting the minute value
      // We need to test hour value to expose error (if any)
      testValue(hour, "Hours");
    }
  };

  const handlePress = (): void => {
    setTimePeriod((prev) => {
      if (prev == "AM") {
        return "PM";
      } else {
        return "AM";
      }
    });
  };

  return (
    <>
      <Text style={globalStyles.para}>{title}</Text>
      <View style={[styles.timeWrapper, additionalStyles]}>
        <CustomTextInput
          style={styles.textInput}
          maxLength={2}
          keyboardType="numeric"
          placeholder={firstPlaceholder}
          onLayout={handleLayout}
          selection={cursorPosition}
          onSelectionChange={handleSelectionChange}
          value={hour}
          onChangeText={handleHourChange}
          // Adding this magically fixes the cursor offcenter issue
          multiline={true}
        />

        <View style={styles.dotWrapper}>
          <View style={[styles.dotCommon, styles.topDot]}></View>
          <View style={styles.dotCommon}></View>
        </View>
        <CustomTextInput
          style={styles.textInput}
          maxLength={2}
          keyboardType="numeric"
          placeholder="00"
          selection={cursorPosition}
          onSelectionChange={handleSelectionChange}
          value={minute}
          onChangeText={handleMinuteChange}
          multiline={true}
        />

        <TouchableOpacity style={styles.toggle} onPress={handlePress}>
          <Text style={styles.toggleText}>{timePeriod}</Text>
        </TouchableOpacity>
      </View>
      {hourErrorText && <Text style={styles.errorText}>{hourErrorText}</Text>}
      {minuteErrorText && (
        <Text style={styles.errorText}>{minuteErrorText}</Text>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  timeWrapper: {
    flexDirection: "row",
    height: 55,
  },

  textInput: {
    height: "100%",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#9ba6a5",
    fontFamily: "inter-regular",
    fontSize: 18,
    color: "black",
    textAlign: "center",
    flex: 1.5,
  },

  dotWrapper: {
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "7%",
  },

  dotCommon: {
    width: 7,
    height: 7,
    borderRadius: 7 / 2,
    backgroundColor: "grey",
  },

  topDot: {
    marginBottom: "-25%",
  },

  toggle: {
    flexDirection: "column",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  toggleText: {
    fontFamily: "inter-regular",
    fontSize: 14,
  },

  errorText: {
    ...globalStyles.para,
    color: "red",
  },
});
