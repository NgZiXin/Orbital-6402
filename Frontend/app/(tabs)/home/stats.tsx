import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { globalStyles } from "@/styles/global";
import PageHeader from "@/components/general/pageHeader";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import ProgressBar from "@/components/general/progressBar";
import { BarChart } from "react-native-gifted-charts";
import { Dimensions } from "react-native";
import WeekToggleModal from "@/components/modal/homePage/weekToggle";
import initialSkeleton from "./sampleData";
import { getItem } from "@/components/general/asyncStorage";

interface WeekDetails {
  total_workout: number;
  total_achievements: number;
  total_distance: number;
  total_duration: number;
  distance_daily: number[];
  duration_daily: number[];
}

const screenWidth: number = Dimensions.get("window").width;

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

function getStartAndEndOfWeek(todayDate: Date): [string, string] {
  // Get the day of the week (0 for Sunday, 1 for Monday, etc.)
  const dayOfWeek = todayDate.getDay();

  // Calculate the start date of the week (Monday)
  const startOfWeek = new Date(todayDate);
  // If today is Sunday (dayOfWeek = 0), we go back 6 days to the previous Monday
  // Otherwise, we go back to the previous Monday
  startOfWeek.setDate(todayDate.getDate() - ((dayOfWeek + 6) % 7));
  const startDate = getFormattedDate(startOfWeek);

  // Calculate the end date of the week (Sunday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  const endDate = getFormattedDate(endOfWeek);

  // Return the start and end dates
  return [startDate, endDate];
}

// Calculate initial values
const today: Date = new Date();
const [initialStart, initialEnd]: [string, string] =
  getStartAndEndOfWeek(today);

export default function Stats() {
  const [dataSkeleton, setDataSkeleton] = useState<any>(initialSkeleton);
  const [weekToggleModal, setWeekToggleModal] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Hardcode for now
  const [weekGoalValues, setWeekGoalValues] = useState<number[]>([7, 9, 30, 4]);

  // Dynamic
  const [weekValues, setWeekValues] = useState<number[]>([]);
  const [progressValues, setProgressValues] = useState<number[]>([]);

  const [dayValues, setDayValues] = useState<number[][]>([]);
  const [dailyDistanceValue, setDailyDistanceValue] = useState<number>(-1);
  const [dailyDurationValue, setDailyDurationValue] = useState<number>(-1);

  function calculateProgress(current: number, goal: number): number {
    // Avoid division by zero
    if (goal === 0) {
      return 0;
    }

    // Force float division, then truncate
    const progress: number = Math.trunc(((current * 1.0) / goal) * 100);
    return progress;
  }

  // on component mount, run the getWeekDetails() once
  useEffect(() => {
    getWeekDetails();
  }, []);

  async function getWeekDetails(): Promise<void> {
    const currentStart: string = selectedWeek[0];
    const [dayS, monthS, yearS]: number[] = currentStart.split("/").map(Number);
    const startDate: Date = new Date(yearS, monthS - 1, dayS);

    const currentEnd: string = selectedWeek[1];
    const [dayE, monthE, yearE]: number[] = currentEnd.split("/").map(Number);
    const endDate: Date = new Date(yearE, monthE - 1, dayE);

    const token: string | null = await getItem("token");

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_DOMAIN}strava_api/get_stats/?start_date=${startDate}&end_date=${endDate}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      }
    );

    // invalid response
    if (!response.ok) {
      setIsLoggedIn(false);
      return;
    }

    // valid response
    setIsLoggedIn(true);
    const weekDetailsObject: WeekDetails = await response.json();
    const weekDetailsValues = Object.values(weekDetailsObject);

    // grab the first 4 values for weekly stats
    const weeklyValues: number[] = weekDetailsValues.slice(0, 4);

    // units coversion
    const totalDistanceValue: number = weeklyValues[2];
    const convertedToKm: number = (totalDistanceValue * 1.0) / 1000;
    weeklyValues[2] = convertedToKm;

    const totalDurationValue: number = weeklyValues[3];
    const convertedToHours: number = (totalDurationValue * 1.0) / 3600;
    weeklyValues[3] = convertedToHours;
    setWeekValues(weeklyValues);

    // calculate progress values for weekly stats
    const progressValuesResult: number[] = weekValues.map((num, index) =>
      calculateProgress(num, weekGoalValues[index])
    );
    setProgressValues(progressValuesResult);

    // grab the last 2 values for daily stats
    const dailyValues: number[][] = weekDetailsValues.slice(4, 6);

    // units conversion
    const dailyDistanceValues: number[] = dailyValues[0];
    const convertedToKm1: number[] = dailyDistanceValues.map(
      (num) => num / 1000
    );
    dailyValues[0] = convertedToKm1;

    const dailyDurationValues: number[] = dailyValues[1];
    const convertedToHours1: number[] = dailyDurationValues.map(
      (num) => num / 3600
    );
    dailyValues[1] = convertedToHours1;
    setDayValues(dailyValues);

    // update the dataSkeleton
    const updatedDataSkeleton = dataSkeleton.map((item: any, index: number) => {
      const distanceThisDay: number = dayValues[0][index];
      const durationThisDay: number = dayValues[1][index];
      return {
        ...item,
        value: dailyDistanceValue,
        onPress: () => {
          setDailyDistanceValue(distanceThisDay);
          setDailyDurationValue(durationThisDay);
        },
      };
    });

    setDataSkeleton(updatedDataSkeleton);
  }

  // store selectedWeek as a string array
  // first value: start day
  // second value: end day
  // format: DD/MM/YYYY
  const [selectedWeek, setSelectedWeek] = useState<[string, string]>([
    initialStart,
    initialEnd,
  ]);

  function handleGoBack() {
    const currentStart: string = selectedWeek[0];

    const [day, month, year]: number[] = currentStart.split("/").map(Number);
    const newEnd: Date = new Date(year, month - 1, day); // Months are zero-indexed, so minus 1

    const newStart: Date = new Date(newEnd);
    newStart.setDate(newStart.getDate() - 7);
    setSelectedWeek(getDates(newStart, newEnd));
    getWeekDetails();
  }

  function handleGoForward(): void {
    const currentEnd: string = selectedWeek[1];

    // prevent you from going beyond this week
    if (currentEnd === initialEnd) {
      setWeekToggleModal(true);
      return;
    }

    const [day, month, year]: number[] = currentEnd.split("/").map(Number);
    const newStart: Date = new Date(year, month - 1, day);

    const newEnd: Date = new Date(newStart);
    newEnd.setDate(newEnd.getDate() + 7);
    setSelectedWeek(getDates(newStart, newEnd));
    getWeekDetails();
  }

  // TODO: milestone 3
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
        {isLoggedIn && (
          <>
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
                      <Text style={styles.highlightedText}>
                        {progressValues[0] + "%"}
                      </Text>
                      progress
                    </Text>
                    <Ionicons
                      name="bicycle-outline"
                      size={35}
                      style={styles.statsIcon}
                    />
                    <ProgressBar
                      leftLabel={weekValues[0]}
                      rightLabel={weekGoalValues[0]}
                      progress={progressValues[0]}
                    />
                  </View>
                  <View style={styles.statsCell}>
                    <Text style={globalStyles.label}>Exercise Duration</Text>
                    <Text style={globalStyles.label}>
                      <Text style={styles.highlightedText}>
                        {progressValues[3] + "%"}
                      </Text>
                      progress
                    </Text>
                    <Ionicons
                      name="time-outline"
                      size={35}
                      style={styles.statsIcon}
                    />
                    <ProgressBar
                      leftLabel={weekValues[3]}
                      rightLabel={weekGoalValues[3]}
                      progress={progressValues[3]}
                    />
                  </View>
                </View>
                <View style={styles.statsHalf}>
                  <View style={[styles.statsCell, styles.statsCellExtra]}>
                    <Text style={globalStyles.label}>Total Distance</Text>
                    <Text style={globalStyles.label}>
                      <Text style={styles.highlightedText}>
                        {progressValues[2] + "%"}
                      </Text>{" "}
                      progress
                    </Text>
                    <Ionicons
                      name="flame-outline"
                      size={35}
                      style={styles.statsIcon}
                    />

                    <ProgressBar
                      leftLabel={weekValues[2]}
                      rightLabel={weekGoalValues[2]}
                      progress={progressValues[2]}
                    />
                  </View>
                  <View style={styles.statsCell}>
                    <Text style={globalStyles.label}>Achievements</Text>
                    <Text style={globalStyles.label}>
                      <Text style={styles.highlightedText}>
                        {progressValues[1] + "%"}
                      </Text>{" "}
                      progress
                    </Text>
                    <Ionicons
                      name="rocket-outline"
                      size={35}
                      style={[styles.statsIcon, styles.iconExtra]}
                    />
                    <ProgressBar
                      leftLabel={weekValues[1]}
                      rightLabel={weekGoalValues[1]}
                      progress={progressValues[1]}
                    />
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
                data={dataSkeleton}
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
                <Text style={styles.topText}>{dailyDistanceValue}</Text>
                <Text style={styles.bottomText}>Distance (km)</Text>
              </View>
              <View>
                <Text style={styles.topText}>{dailyDurationValue}</Text>
                <Text style={styles.bottomText}>Duration (hr:min)</Text>
              </View>
            </View>

            {weekToggleModal && (
              <WeekToggleModal setWeekToggleModal={setWeekToggleModal} />
            )}
          </>
        )}

        {!isLoggedIn && (
          <View
            style={{
              backgroundColor: "#F6F2F2",
              borderRadius: 10,
              padding: 10,
            }}
          >
            <Text style={globalStyles.para}>
              You must log into strava first before viewing your workout
              statistics!
            </Text>
          </View>
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
