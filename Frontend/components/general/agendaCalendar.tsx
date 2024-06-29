import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { globalStyles } from "@/styles/global";

import { Agenda, DateData } from "react-native-calendars";

function timeToString(time: number): string {
  const date = new Date(time);
  return date.toISOString().split("T")[0];
}

interface CalendarItem {
  name: string;
  day: string;
}

// items must match the shape specified by the docs (refer to docs)
type CalendarItems = {
  [key: string]: CalendarItem[];
};

const getDates = () => {
  const todayDate = new Date().toISOString().split("T")[0];

  const laterDate = new Date();
  laterDate.setMonth(laterDate.getMonth() + 2);
  const twoMonthsLater = laterDate.toISOString().split("T")[0];

  return { todayDate, twoMonthsLater };
};

const { todayDate, twoMonthsLater } = getDates();

export default function AgendaCalendar() {
  const [items, setItems] = useState<CalendarItems>({});

  // currently: using sample items
  // in future: use items pulled from backend database
  function loadItems(day: DateData) {
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime: string = timeToString(time);

        if (!items[strTime] && new Date(strTime) <= new Date(twoMonthsLater)) {
          items[strTime] = [];

          const numItems = Math.floor(Math.random() * 3 + 1);
          for (let j = 0; j < numItems; j++) {
            items[strTime].push({
              name: "Item for " + strTime + " #" + j,
              day: strTime,
            });
          }
        }
      }

      const newItems: CalendarItems = {};
      Object.keys(items).forEach((key) => {
        newItems[key] = items[key];
      });
      setItems(newItems);
    }, 500);
  }

  const renderItem = (item: CalendarItem, isFirst: boolean) => {
    return (
      <TouchableOpacity
        style={[styles.item, isFirst == true ? { marginTop: 30 } : undefined]}
      >
        <Text style={globalStyles.para}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  // Optimization
  // If two items have different names, re-render the items
  const rowHasChanged = (r1: CalendarItem, r2: CalendarItem) => {
    return r1.name !== r2.name;
  };

  return (
    <View style={{ flex: 1, paddingTop: 5 }}>
      <Agenda
        //@ts-ignore
        items={items}
        loadItemsForMonth={loadItems}
        selected={todayDate}
        maxDate={twoMonthsLater}
        futureScrollRange={3} // + 1 as buffer
        renderItem={renderItem}
        renderEmptyDate={() => {
          return <></>;
        }}
        renderEmptyData={() => {
          return <></>;
        }}
        rowHasChanged={rowHasChanged}
        firstDay={1}
        weekStartsOn={1}
        showClosingKnob={true}
        markedDates={{}}
        hideExtraDays={true}
        theme={
          {
            "stylesheet.agenda.main": {
              weekdays: {
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                flexDirection: "row",
                justifyContent: "space-around",
                marginLeft: 15,
                marginRight: 15,

                paddingTop: 15,
                paddingBottom: 4.5,
                backgroundColor: "white",
              },

              knobContainer: {
                flex: 1,
                position: "absolute",
                left: 0,
                right: 0,
                height: 24,
                bottom: 3,
                alignItems: "center",
                backgroundColor: "white",
                marginBottom: -3, // balance out
              },

              reservations: {
                backgroundColor: "#F6F2F2",
                flex: 1,
                marginTop: 92,
                paddingBottom: 18,
              },
            },

            "stylesheet.calendar.header": {
              dayTextAtIndex5: {
                // saturday
                color: "red",
              },

              dayTextAtIndex6: {
                // sunday
                color: "red",
              },

              backgroundColor: "red",
            },

            textDayFontFamily: "inter-semibold",
            textDayHeaderFontFamily: "inter-semibold",
            textMonthFontFamily: "inter-semibold",

            todayTextColor: "red",
            textSectionTitleColor: "#A3ADB8", // for the day headers
            selectedDayTextColor: "#2D4150",
            selectedDayBackgroundColor: "pink",
            agendaDayNumColor: "#929BA5", // one shade darker than day header color
            agendaDayTextColor: "#929BA5",
            agendaTodayColor: "red",
            agendaKnobColor: "#F6F2F2",
          } as any
        }
        style={{ position: "relative", bottom: 7 }} // so the max future date is fully visible
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
});
