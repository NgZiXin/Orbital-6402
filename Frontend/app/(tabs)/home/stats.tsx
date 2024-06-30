import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { globalStyles } from "@/styles/global";
import PageHeader from "@/components/general/pageHeader";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import ProgressBar from "@/components/general/progressBar";
import { BarChart } from "react-native-gifted-charts";
import { Dimensions } from "react-native";
import WeekToggleModal from "@/components/modal/homePage/weekToggle";

const screenWidth: number = Dimensions.get("window").width;

// sample data
const data = [
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

function getFormattedDate(dateInput: Date): string {
  let day: number = dateInput.getDate();
  let month: number = dateInput.getMonth() + 1; // Months are zero-indexed, so add 1
  let year: number = dateInput.getFullYear();

  // Format to DD/MM/YYYY
  let formattedDate: string = `${day < 10 ? "0" + day : day}/${
    month < 10 ? "0" + month : month
  }/${year}`;
  return formattedDate;
}

// where start: one week before end
function getDates(start: Date, end: Date): [string, string] {
  const startDate: string = getFormattedDate(start);
  const endDate: string = getFormattedDate(end);
  return [startDate, endDate];
}

// calculate intial values
const oneWeekBeforeToday: Date = new Date();
oneWeekBeforeToday.setDate(oneWeekBeforeToday.getDate() - 7);
const today: Date = new Date();
const [initialStart, initialEnd] = getDates(oneWeekBeforeToday, today);

export default function Stats() {
  const [weekToggleModal, setWeekToggleModal] = useState<boolean>(false);

  // store selectedWeek as a string array
  // first value: start day
  // second value: end day
  // format: DD/MM/YYYY
  const [selectedWeek, setSelectedWeek] = useState<[string, string]>([
    initialStart,
    initialEnd,
  ]);

  function handleGoBack(): void {
    const currentStart: string = selectedWeek[0];

    const [day, month, year]: number[] = currentStart.split("/").map(Number);
    const newEnd: Date = new Date(year, month - 1, day); // Months are zero-indexed, so minus 1

    const newStart: Date = new Date(newEnd);
    newStart.setDate(newStart.getDate() - 7);
    setSelectedWeek(getDates(newStart, newEnd));
  }

  function handleGoForward(): void {
    const currentEnd: string = selectedWeek[1];

    // prevent you from going beyond today
    if (currentEnd === initialEnd) {
      setWeekToggleModal(true);
      return;
    }

    const [day, month, year]: number[] = currentEnd.split("/").map(Number);
    const newStart: Date = new Date(year, month - 1, day);

    const newEnd: Date = new Date(newStart);
    newEnd.setDate(newEnd.getDate() + 7);
    setSelectedWeek(getDates(newStart, newEnd));
  }

  function handleSetGoals() {
    console.log("todo");
  }

  function handleViewAll() {
    console.log("todo");
  }

  return (
    <View style={globalStyles.container}>
      {/* paddingHorizontal: 10, then each wrapper: paddingHorizontal: 2 */}
      {/* to prevent scrollview from cutting elements off horizontally */}
      <ScrollView
        style={{ marginTop: 57, padding: 12, paddingHorizontal: 10 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 2 }}>
          <PageHeader
            topText="Summary"
            bottomText="Weekly Performance"
            topTextNoMarginTop={true}
          />
        </View>

        <View style={styles.statsWrapper}>
          <View style={styles.weekToggle}>
            <TouchableOpacity onPress={handleGoBack}>
              <Ionicons
                name="arrow-back-circle-outline"
                size={25}
                style={styles.leftArrow}
              />
            </TouchableOpacity>

            <Text style={globalStyles.para}>
              {selectedWeek[0] + " - " + selectedWeek[1]}
            </Text>

            <TouchableOpacity onPress={handleGoForward}>
              <Ionicons
                name="arrow-forward-circle-outline"
                size={25}
                style={styles.rightArrow}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.stats}>
            <View style={styles.statsHalf}>
              <View style={[styles.statsCell, styles.statsCellExtra]}>
                <Text style={globalStyles.label}>Workout Count</Text>
                <Text style={globalStyles.label}>
                  <Text style={styles.highlightedText}>57%</Text> progress
                </Text>
                <Ionicons
                  name="bicycle-outline"
                  size={35}
                  style={styles.statsIcon}
                />
                <ProgressBar leftLabel="4" rightLabel="7" progress="57%" />
              </View>
              <View style={styles.statsCell}>
                <Text style={globalStyles.label}>Exercise Duration</Text>
                <Text style={globalStyles.label}>
                  <Text style={styles.highlightedText}>100%</Text> progress
                </Text>
                <Ionicons
                  name="time-outline"
                  size={35}
                  style={styles.statsIcon}
                />
                <ProgressBar
                  leftLabel="5.5hr"
                  rightLabel="5.5hr"
                  progress="100%"
                />
              </View>
            </View>
            <View style={styles.statsHalf}>
              <View style={[styles.statsCell, styles.statsCellExtra]}>
                <Text style={globalStyles.label}>Total Distance</Text>
                <Text style={globalStyles.label}>
                  <Text style={styles.highlightedText}>69%</Text> progress
                </Text>
                <Ionicons
                  name="flame-outline"
                  size={35}
                  style={styles.statsIcon}
                />

                <ProgressBar
                  leftLabel="20.7km"
                  rightLabel="30km"
                  progress="69%"
                />
              </View>
              <View style={styles.statsCell}>
                <Text style={globalStyles.label}>Achievements</Text>
                <Text style={globalStyles.label}>
                  <Text style={styles.highlightedText}>50%</Text> progress
                </Text>
                <Ionicons
                  name="rocket-outline"
                  size={35}
                  style={[styles.statsIcon, styles.iconExtra]}
                />
                <ProgressBar leftLabel="2" rightLabel="4" progress="50%" />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.buttonsWrapper}>
          <TouchableOpacity onPress={handleSetGoals} style={styles.button}>
            <Text style={globalStyles.para}>Set Goals</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleViewAll}
            style={[styles.button, styles.buttonExtra]}
          >
            <Text style={globalStyles.para}>View All</Text>
          </TouchableOpacity>
        </View>

        <PageHeader topText="" bottomText="Weekly Mileage" />
        <View style={styles.barChartWrapper}>
          <BarChart
            // general
            data={data}
            width={screenWidth - 24} // since padding of 12
            hideRules
            hideOrigin
            // handle y-axis
            showYAxisIndices={false}
            hideYAxisText
            yAxisThickness={0}
            yAxisLabelWidth={0}
            // handle x-axis
            disableScroll
            initialSpacing={0}
            spacing={20}
            barWidth={(screenWidth - 24 - 120) / 7} // maths
            xAxisLength={screenWidth - 25}
            parentWidth={screenWidth - 24}
            //styling
            frontColor="#FBB3B3"
            xAxisLabelTextStyle={globalStyles.label}
            barBorderBottomLeftRadius={0}
            barBorderBottomRightRadius={0}
            barBorderRadius={7}
          />
        </View>

        <View style={styles.selectedDayStatsWrapper}>
          <View style={styles.selectedDayStatCell1}>
            <Text style={styles.topText}>10.0</Text>
            <Text style={styles.bottomText}>Distance (km)</Text>
          </View>
          <View>
            <Text style={styles.topText}>1:10</Text>
            <Text style={styles.bottomText}>Duration (hr:min)</Text>
          </View>
        </View>

        {weekToggleModal && (
          <WeekToggleModal setWeekToggleModal={setWeekToggleModal} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  statsWrapper: {
    marginTop: "-7%",
    height: 385,
    paddingHorizontal: 2,
  },

  weekToggle: {
    height: "15%",
    paddingHorizontal: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "-2%",
  },

  leftArrow: {
    position: "relative",
    right: 4,
  },

  rightArrow: {
    position: "relative",
    left: 4,
  },

  stats: {
    height: "85%",
    borderRadius: 7,
  },

  statsHalf: {
    height: "50%",
    flexDirection: "row",
    marginBottom: "3%",
  },

  statsCell: {
    ...globalStyles.cardV2,
    width: "48%",
    height: "100%",
    padding: 15,
  },

  statsCellExtra: {
    marginRight: "4%",
  },

  highlightedText: {
    fontSize: 13.5,
  },

  statsIcon: {
    position: "relative",
    left: "77%",
    top: "5.5%",
  },

  iconExtra: {
    top: "6.5%",
  },

  buttonsWrapper: {
    flexDirection: "row",
    marginTop: "4.5%",
    marginBottom: "15%",
    paddingHorizontal: 2,
  },

  button: {
    width: "31%",
    backgroundColor: "#F6F2F2",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-evenly",
  },

  buttonExtra: {
    marginLeft: "2.5%",
  },

  barChartWrapper: {
    marginTop: "-27%",
    marginBottom: "10%",
    paddingHorizontal: 2,
  },

  selectedDayStatsWrapper: {
    marginTop: "-5%",
    marginBottom: "10%",
    flexDirection: "row",
    paddingHorizontal: 2,
  },

  selectedDayStatCell1: {
    marginRight: "7%",
  },

  topText: {
    ...globalStyles.header,
    fontSize: 16,
    marginBottom: "-7%",
  },

  bottomText: {
    ...globalStyles.para,
    lineHeight: 17,
  },
});
