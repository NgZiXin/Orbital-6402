import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { globalStyles } from "@/styles/global";
import { getToken } from "@/utility/general/userToken";
import CalendarListModal from "../modal/homePage/calendarPage/calendarList";
import { MarkedDates } from "react-native-calendars/src/types";
import {
  dateComparison,
  monthsBetween,
  getDayOfWeek,
  oneDayLater,
} from "@/utility/home/dateProcessing";
import { FlashList, ListRenderItem, ViewToken } from "@shopify/flash-list";
import { numberToMonthMap } from "@/constants/monthMap";
import SubmitButton from "./submit";
import EditAgendaModal from "../modal/homePage/calendarPage/editAgenda";
import DeleteAgendaModal from "../modal/homePage/calendarPage/deleteAgenda";

interface CalendarItem {
  id?: number;
  databaseId?: number;
  header: string;
  date: string;
  start_time: string;
  end_time: string;
  body: string;
}

interface CalendarItems {
  [key: string]: CalendarItem[];
}

interface AgendaCalendarProps {
  updateFlag: boolean;
  setUpdateFlag: (updateFunction: (prevValue: boolean) => boolean) => void;
}

// UTC+8, match this computer's timezone
const todayDate: Date = new Date();
todayDate.setHours(todayDate.getHours() + 8);

const todayDateFormatted: string = todayDate.toISOString().split("T")[0];
const [year, month, _] = todayDateFormatted.split("-");

let initialMarkedDates: MarkedDates = {};
initialMarkedDates[todayDateFormatted] = { selected: true };

export default function AgendaCalendar({
  updateFlag,
  setUpdateFlag,
}: AgendaCalendarProps) {
  const flashListRef = useRef<FlashList<any>>(null);

  // Need default values!
  // Before any agenda exists
  const minDate = useRef<string>(todayDateFormatted);
  const maxDate = useRef<string>(todayDateFormatted);
  const markedDates = useRef<MarkedDates>(initialMarkedDates);
  const selectedDate = useRef<string>(todayDateFormatted);

  // To store (month, year) that we have already created header for
  // Local variable so it repopulates each time list re-renders
  const seen: [string, string][] = [];

  const [monthYear, setMonthYear] = useState<string[]>([month, year]);
  const [items, setItems] = useState<CalendarItems | null>(null);
  const [calendarList, setCalendarList] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [editId, setEditId] = useState<number>(-1);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number>(-1);
  const [listHeight, setListHeight] = useState<number>(-1);
  const [lastHeight, setLastHeight] = useState<number>(-1);

  useEffect(() => {
    getItems();
  }, [updateFlag]);

  const getItems = async (): Promise<void> => {
    try {
      const token: string | null = await getToken("token");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_DOMAIN}calendar/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      // Backend raises an error
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Successful response
      // Extract out the data response
      const dataArray: CalendarItem[] = await response.json();

      // Sort the array
      // By date --> then by start time --> then by end time
      dataArray.sort((first: CalendarItem, second: CalendarItem) => {
        const dateComparisonResult = dateComparison(first.date, second.date);
        if (dateComparisonResult !== 0) {
          return dateComparisonResult;
        }
        const startTimeComparison = first.start_time.localeCompare(
          second.start_time
        );
        if (startTimeComparison !== 0) {
          return startTimeComparison;
        }
        return first.end_time.localeCompare(second.end_time);
      });

      // Iterate through the entries
      // Populate the itemResult array
      let currentDate: string | null = null;
      let itemsResult: CalendarItems = {};

      // Edge case, early return
      if (dataArray.length === 0) {
        // Force re-render
        setItems(null);
        return;
      }

      for (let i = 0; i < dataArray.length; i++) {
        const item: CalendarItem = dataArray[i];

        const dateValue = dataArray[i].date;

        if (currentDate == null) {
          currentDate = dateValue;
          itemsResult[currentDate] = [];
          // Earliest date with agenda
          minDate.current = currentDate;
        } else {
          const dateComparisonResult = dateComparison(dateValue, currentDate);
          if (dateComparisonResult > 0) {
            currentDate = dateValue;
            itemsResult[currentDate] = [];
          }
        }

        // Copy over the id into a new field
        // Remove the old field
        // Since Flashlist advices against any key/id props inside items
        item["databaseId"] = item.id;
        delete item["id"];

        itemsResult[currentDate].push(item);
      }

      // Latest date with agenda
      maxDate.current = currentDate as string;

      // Fill in a dummy item at the end
      const dummyItem: CalendarItem = {
        header: "",
        date: "",
        start_time: "",
        end_time: "",
        body: "dummyItem",
      };

      const dummyDate = oneDayLater(currentDate as string);
      itemsResult[dummyDate] = [];
      itemsResult[dummyDate].push(dummyItem);

      // Populate the markedDateResult array (change this name to activeDateResult!)
      let markedDateResult: MarkedDates = {};
      Object.keys(itemsResult).forEach((date) => {
        // Don't set dummyDate as active
        if (date !== dummyDate) {
          markedDateResult[date] = {
            // Make the initial day selected
            selected: date === minDate.current ? true : false,
          };
        }
      });

      markedDates.current = markedDateResult;
      selectedDate.current = minDate.current;

      setMonthYear([
        minDate.current.split("-")[1],
        minDate.current.split("-")[0],
      ]);

      setItems(itemsResult);

      // Catch other errors
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const handleEdit = (databaseId: number) => {
    setEditModal(true);
    setEditId(databaseId);
  };

  const handleDelete = async (databaseId: number): Promise<void> => {
    setDeleteModal(true);
    setDeleteId(databaseId);
  };

  const renderItem: ListRenderItem<[string, CalendarItem[]]> = ({
    item,
    index,
  }) => {
    const [date, calendarItems] = item;
    const [year, month, day] = date.split("-");
    const dayOfWeek: string = getDayOfWeek(date);

    const hasHeader: boolean = seen.some(
      (item) => item[0] === month && item[1] === year
    );

    if (!hasHeader) {
      seen.push([month, year]);
    }

    const isFirstItem: boolean = true ? index === 0 : false;
    const isDummyItem: boolean = true
      ? calendarItems[0].body === "dummyItem"
      : false;

    const isLast: boolean = true ? date === maxDate.current : false;

    return (
      <>
        {!isDummyItem && (
          <View
            style={styles.itemWrapper}
            onLayout={(e: any) => handleItemLayout(e, isLast)}
          >
            {!hasHeader && (
              <View
                style={[
                  styles.itemHeaderWrapper,
                  // So that when scrolled to
                  // First item has the same top spacing as others
                  isFirstItem ? { marginTop: 0.02 * listHeight } : undefined,
                ]}
              >
                <Text style={styles.itemHeader}>
                  {numberToMonthMap[month] + ", " + year}
                </Text>
              </View>
            )}
            <View style={styles.itemBodyWrapper}>
              <View style={styles.dayWrapper}>
                <Text
                  style={
                    date === todayDateFormatted
                      ? [styles.dayNumber, styles.dayHighlighted]
                      : styles.dayNumber
                  }
                >
                  {day}
                </Text>
                <Text
                  style={
                    date === todayDateFormatted
                      ? [styles.dayName, styles.dayHighlighted]
                      : styles.dayName
                  }
                >
                  {dayOfWeek}
                </Text>
              </View>

              <View style={styles.dayItemsWrapper}>
                {calendarItems.map((calendarItem, innerIndex) => (
                  <View
                    // Unique key constructed from index
                    key={index.toString() + innerIndex.toString()}
                    style={styles.item}
                  >
                    <View style={styles.agendaHeaderWrapper}>
                      <Text style={globalStyles.header}>
                        {calendarItem.header}
                      </Text>
                      <View style={styles.iconWrapper}>
                        <SubmitButton
                          onPressHandler={() =>
                            handleEdit(calendarItem.databaseId as number)
                          }
                          icon={["create-outline", 19, {}]}
                          style={styles.submitButton}
                        />

                        <SubmitButton
                          onPressHandler={() =>
                            handleDelete(calendarItem.databaseId as number)
                          }
                          icon={["close-outline", 22, {}]}
                          style={styles.submitButton}
                        />
                      </View>
                    </View>

                    <Text style={styles.itemTime}>
                      {calendarItem.start_time} - {calendarItem.end_time}
                    </Text>
                    <Text style={styles.itemText}>{calendarItem.body}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {isDummyItem && lastHeight !== -1 && (
          // 22 is the bottom margin of the last item (not captured by onLayout)
          // Last term is accounting for viewPos: 0.03
          <View
            style={{ height: listHeight - lastHeight - 22 - 0.02 * listHeight }}
          ></View>
        )}
      </>
    );
  };

  // TODO: future (think about fwd and bwd scroll, as well as how to identify them!)
  const onViewableItemsChanged = useCallback(
    // No dependencies within the body
    // Memoize once and re-use
    ({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
      if (viewableItems.length > 0) {
        // Simply look at the first item's date
        const firstItemDate: string = viewableItems[0].item[0];
        const [year, month, _] = firstItemDate.split("-");
        setMonthYear([month, year]);
      }
    },
    []
  );

  const handleScrollToIndex = (index: number) => {
    // Set timeout to allow time for list to load in first
    // Before scrolling to index
    setTimeout(() => {
      flashListRef.current?.scrollToIndex({
        index: index,
        animated: true,
        // Scroll to near the top of the visible position
        viewPosition: 0.02,
      });
    }, 500);
  };

  const handleListLayout = (e: any): void => {
    e.persist();
    const { height } = e.nativeEvent.layout;
    if (listHeight < 0) {
      setListHeight(height);
    }
  };

  const handleItemLayout = (e: any, isLast: boolean): void => {
    e.persist();
    const { height } = e.nativeEvent.layout;
    if (isLast && lastHeight < 0) {
      setLastHeight(height);
    }
  };

  return (
    <>
      <SubmitButton
        onPressHandler={() => setCalendarList(true)}
        text={"From: " + numberToMonthMap[monthYear[0]] + " " + monthYear[1]}
        // text="Choose a date"
        icon={["chevron-down-outline", 20, styles.icon]}
        style={styles.button}
        textStyle={styles.buttonText}
      />

      {minDate.current &&
        maxDate.current &&
        markedDates.current &&
        selectedDate.current && (
          <CalendarListModal
            minDate={minDate}
            maxDate={maxDate}
            markedDates={markedDates}
            prevSelected={selectedDate}
            visibility={calendarList}
            setVisibility={setCalendarList}
            setMonthYear={setMonthYear}
            handleScrollToIndex={handleScrollToIndex}
          />
        )}

      <View style={styles.listWrapper} onLayout={handleListLayout}>
        {items && (
          <FlashList
            ref={flashListRef}
            data={Object.entries(items)}
            // Assuming 30 days a month, 1 item each day
            estimatedItemSize={
              (monthsBetween(minDate.current, maxDate.current) + 1) * 30
            }
            renderItem={renderItem}
            // onViewableItemsChanged={onViewableItemsChanged}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              backgroundColor: "#F6F2F2",
            }}
          />
        )}

        {!items && (
          <View style={styles.noItemWrapper}>
            <Text style={globalStyles.header}>Oops!</Text>
            <Text style={globalStyles.para}>No existing agenda items.</Text>
            <Text style={globalStyles.label}>
              Click the button below to add items.
            </Text>
          </View>
        )}
      </View>

      <EditAgendaModal
        visibility={editModal}
        setVisibility={setEditModal}
        databaseId={editId}
        setUpdateFlag={setUpdateFlag}
      />

      <DeleteAgendaModal
        visibility={deleteModal}
        setVisibility={setDeleteModal}
        databaseId={deleteId}
        setUpdateFlag={setUpdateFlag}
      />
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    ...globalStyles.cardV2,
    marginTop: 5,
    padding: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    ...globalStyles.header,
    fontFamily: "inter-regular",
    textAlign: "center",
  },

  icon: {
    marginTop: 3,
    marginLeft: 7,
  },

  listWrapper: {
    marginTop: 17,
    borderRadius: 10,
    // If child flashlist overflows, hide the exceeded parts
    // Thus achieving a border radius effect
    overflow: "hidden",
    backgroundColor: "#F6F2F2",
    flex: 1,
  },

  itemWrapper: {
    marginBottom: 22,
  },

  // For debugging, dont remove
  itemHeaderWrapper: {
    // backgroundColor: "pink",
  },

  itemHeader: {
    fontFamily: "inter-regular",
    fontSize: 14,
    color: "#929BA5",
    marginLeft: 15,
  },

  itemBodyWrapper: {
    flexDirection: "row",
    // backgroundColor: "green",
  },

  dayWrapper: {
    width: "20%",
    alignItems: "center",
    marginTop: 6,
  },

  dayNumber: {
    ...globalStyles.header,
    fontSize: 20,
    color: "#929BA5",
    position: "relative",
    right: 1,
  },

  dayName: {
    ...globalStyles.para,
    color: "#929BA5",
    marginTop: -12,
    position: "relative",
    right: 1,
  },

  dayHighlighted: {
    color: "red",
  },

  dayItemsWrapper: {
    width: "80%",
  },

  item: {
    backgroundColor: "white",
    borderRadius: 7,
    padding: 10,
    paddingTop: 5,
    marginRight: 10,
    marginTop: 10,
  },

  agendaHeaderWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  iconWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: -17,
  },

  submitButton: {
    backgroundColor: "white",
    borderRadius: 0,
    margin: 0,
  },

  itemTime: {
    ...globalStyles.para,
    marginTop: -7,
  },

  itemText: {
    ...globalStyles.para,
    marginTop: 7,
  },

  noItemWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
