import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

import { MutableRefObject } from "react";
import GeneralModalTemplate from "../../templates/generalModalTemplate";
import { CalendarList } from "react-native-calendars";
import { monthsBetween } from "@/utility/home/dateProcessing";
import { MarkedDates } from "react-native-calendars/src/types";
import { MarkingProps } from "react-native-calendars/src/calendar/day/marking";

// dun delete bitch
interface Day {
  dateString: string;
  day: number;
  month: number;
  timestamp: number;
  year: number;
}

interface CalendarListModalProps {
  minDate: MutableRefObject<string>;
  maxDate: MutableRefObject<string>;
  markedDates: MutableRefObject<MarkedDates>;
  prevSelected: MutableRefObject<string>;
  visibility: boolean;
  setVisibility: (newValue: boolean) => void;
  setMonthYear: (newValue: string[]) => void;
  handleScrollToIndex: (index: number) => void;
}

const screenWidth: number = Dimensions.get("window").width;

// Total horizontal padding of 30
// For modal components
const updatedWidth = screenWidth - 30;

// UTC+8, match this computer's timezone
const todayDate: Date = new Date();
todayDate.setHours(todayDate.getHours() + 8);
const todayDateFormatted: string = todayDate.toISOString().split("T")[0];

export default function CalendarListModal({
  minDate,
  maxDate,
  markedDates,
  prevSelected,
  visibility,
  setVisibility,
  setMonthYear,
  handleScrollToIndex,
}: CalendarListModalProps) {
  // This replaces onDayPress
  // Since we have custom day component
  const handleDayPress = (selectedDate: string, isActive: MarkingProps) => {
    // isActive is undefined
    if (!isActive) {
      return;
    }

    // isActive is a MarkingProps object
    let newMarkedDates = {};
    if (prevSelected.current !== selectedDate) {
      markedDates.current[selectedDate].selected = true;
      markedDates.current[prevSelected.current].selected = false;
    }

    // We need to always create a new object
    // So that the changes is reflected
    newMarkedDates = {
      ...markedDates.current,
    };

    prevSelected.current = selectedDate;
    markedDates.current = newMarkedDates;

    const [yearString, monthString, _] = selectedDate.split("-");
    const scrollPosition = Object.keys(markedDates.current).indexOf(
      selectedDate
    );

    setVisibility(false);
    handleScrollToIndex(scrollPosition);
    setMonthYear([monthString, yearString]);
  };

  return (
    <>
      <GeneralModalTemplate
        visibleState={visibility}
        additionalStyles={styles.modalDimmension}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <CalendarList
            current={prevSelected.current}
            minDate={minDate.current}
            maxDate={maxDate.current}
            pastScrollRange={
              monthsBetween(minDate.current, prevSelected.current) + 1
            }
            futureScrollRange={
              monthsBetween(prevSelected.current, maxDate.current) + 1
            }
            firstDay={1}
            calendarWidth={updatedWidth}
            hideExtraDays={true}
            markedDates={markedDates.current}
            theme={
              {
                "stylesheet.calendar.header": {
                  dayTextAtIndex5: {
                    // Saturday
                    color: "red",
                  },

                  dayTextAtIndex6: {
                    // Sunday
                    color: "red",
                  },
                },

                textDayHeaderFontFamily: "inter-semibold",
                textMonthFontFamily: "inter-semibold",
                textSectionTitleColor: "#A3ADB8", // For the day headers
              } as any
            }
            dayComponent={({ date }: any) => {
              const dateString: string = date.dateString;
              const isActive: MarkingProps | undefined =
                markedDates.current[dateString];

              let isSelected: boolean | null = null;
              if (isActive) {
                isSelected = isActive.selected as boolean;
              }

              // Process the different cases
              let textStyle = [];
              if (isActive) {
                textStyle.push(styles.activeText);
                if (isSelected) {
                  textStyle.push(styles.selectedText);
                }

                if (dateString === todayDateFormatted) {
                  textStyle.push(styles.todayTextActive);
                }
              } else {
                textStyle.push(styles.disableText);
                if (dateString === todayDateFormatted) {
                  textStyle.push(styles.todayTextDisabled);
                }
              }

              return (
                <TouchableOpacity
                  onPress={() => handleDayPress(dateString, isActive)}
                  style={[
                    styles.textContainer,
                    isSelected ? styles.textContainerSelected : undefined,
                  ]}
                >
                  <Text style={textStyle}>{date.day}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </KeyboardAvoidingView>
      </GeneralModalTemplate>
    </>
  );
}

const styles = StyleSheet.create({
  modalDimmension: {
    width: "100%",
    height: "100%",
  },

  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 32,
    height: 32,
  },

  textContainerSelected: {
    borderRadius: 16,
    backgroundColor: "#F4F4F3",
  },

  textCommon: {
    fontFamily: "inter-regular",
    fontSize: 12,
  },

  activeText: {
    color: "#2D4150",
  },

  disableText: {
    color: "#D9E1E8",
  },

  selectedText: {
    color: "#2D4150",
  },

  todayTextActive: {
    color: "red",
  },

  todayTextDisabled: {
    color: "#FDD0D0",
  },
});
