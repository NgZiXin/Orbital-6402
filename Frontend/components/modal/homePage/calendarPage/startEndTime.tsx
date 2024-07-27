import { Alert, StyleSheet, Text, View } from "react-native";

import { globalStyles } from "@/styles/global";
import { useRef, useState } from "react";
import SubmitButton from "@/components/general/submit";
import GeneralModalTemplate from "../../templates/generalModalTemplate";
import TimeInput from "@/components/general/timeInput";
import StartEndTimeCheckModal from "./startEndTimeCheck";

interface StartEndTimesModalProps {
  visibility: boolean;
  setVisibility: (newValue: boolean) => void;
  selected: React.MutableRefObject<boolean>;
  setValue: (newValue: string) => void;
  formikProps: any;
}

export default function StartEndTimesModal({
  visibility,
  setVisibility,
  selected,
  setValue,
  formikProps,
}: StartEndTimesModalProps) {
  const startTime = useRef<string[]>([]);
  const endTime = useRef<string[]>([]);
  const notTwoDigits = useRef<boolean>(false);
  const errorMessage = useRef<string>("");
  const [checkModal, setCheckModal] = useState<boolean>(false);

  const handleCancel = (): void => {
    // Has been visited and value is missing
    // Thus, trigger validation
    formikProps.setFieldTouched("startTime", true);
    formikProps.setFieldTouched("endTime", true);
    setVisibility(false);
  };

  // Processes the start/end time (in array form)
  // Returns string time in 24hr notation
  const getTime = (time: string[]): string => {
    const [hour, minute, period] = time;
    let result: string = "";
    if (period == "AM") {
      if (hour != "12") {
        result = hour + minute;
      } else {
        result = "00" + minute;
      }
    } else {
      if (hour != "12") {
        // Original hour ranges from 01 - 11
        // So, newHour is always correct
        const newHour = (parseInt(hour) + 12).toString();
        result = newHour + minute;
      } else {
        result = hour + minute;
      }
    }

    return result;
  };

  const handleOk = (): void => {
    if (notTwoDigits.current) {
      setCheckModal(true);
      errorMessage.current = "All the values entered must be in double digits!";
      return;
    }

    const startTimeProcessed: string = getTime(startTime.current);
    const endTimeProcessed: string = getTime(endTime.current);

    // Checks if start time comes before end time
    if (parseInt(startTimeProcessed) < parseInt(endTimeProcessed)) {
      selected.current = true;
      setValue(startTimeProcessed + " - " + endTimeProcessed);
      setVisibility(false);
      formikProps.setFieldValue("startTime", startTimeProcessed);
      formikProps.setFieldValue("endTime", endTimeProcessed);

      // Reset to defaults
      startTime.current = [];
      endTime.current = [];
    } else {
      setCheckModal(true);
      errorMessage.current =
        "Your selected start time must come before your end time!";
      return;
    }
  };

  return (
    <>
      <GeneralModalTemplate visibleState={visibility}>
        <Text style={styles.modalHeader}>Start & End Times</Text>

        <TimeInput
          title="Start time"
          startTime={startTime}
          notTwoDigits={notTwoDigits}
        />
        <TimeInput
          title="End time"
          endTime={endTime}
          notTwoDigits={notTwoDigits}
        />

        <View style={styles.buttonWrapper}>
          <SubmitButton
            text="Cancel"
            onPressHandler={handleCancel}
            style={styles.button}
          />
          <SubmitButton
            text="Ok"
            onPressHandler={handleOk}
            style={styles.button}
          />
        </View>

        <StartEndTimeCheckModal
          visibility={checkModal}
          setVisibility={setCheckModal}
          message={errorMessage.current}
        />
      </GeneralModalTemplate>
    </>
  );
}

const styles = StyleSheet.create({
  modalHeader: {
    ...globalStyles.header,
    marginBottom: 1,
  },

  buttonWrapper: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
  },

  button: {
    width: "30%",
    marginLeft: 10,
  },

  errorText: {
    ...globalStyles.para,
    color: "red",
  },
});
