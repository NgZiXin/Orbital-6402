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
import { BarChart, barDataItem } from "react-native-gifted-charts";
import { Dimensions } from "react-native";
import WeekToggleModal from "@/components/modal/homePage/weekToggle";
import { getToken } from "@/utility/general/userToken";
import { useLoading } from "@/hooks/useLoading";
import SetGoalsModal from "@/components/modal/homePage/statsPage/setGoals";

import {
  getDates,
  getInitialDates,
  stringToDate,
} from "@/utility/home/dateProcessing";

import {
  calculateProgress,
  metersToKilometers,
  secondsToHours,
} from "@/utility/home/dataProcessing";

interface WeekDetails {
  total_workout: number;
  total_achievements: number;
  total_distance: number;
  total_duration: number;
  distance_daily: number[];
  duration_daily: number[];
}

interface DayMap {
  [key: number]: string;
}

const indexToDayMap: DayMap = {
  0: "Mon",
  1: "Tues",
  2: "Wed",
  3: "Thurs",
  4: "Fri",
  5: "Sat",
  6: "Sun",
};

const dataSkeleton: barDataItem[] = [
  { value: 0 },
  { value: 0 },
  { value: 0 },
  { value: 0 },
  { value: 0 },
  { value: 0 },
  { value: 0 },
];

// Calculate screen width
const screenWidth: number = Dimensions.get("window").width;

// Calculate initial week start & week end dates
const today: Date = new Date();
const [initialWeekStart, initialWeekEnd]: [string, string] =
  getInitialDates(today);

export default function Stats() {
  const { showLoading, hideLoading } = useLoading();

  const [selectedWeek, setSelectedWeek] = useState<[string, string]>([
    initialWeekStart,
    initialWeekEnd,
  ]);

  // Initially, set barData to the dataSkeleton object array
  // This sets up our 7 bar objects (ie: days) for further processing later
  const [barData, setBarData] = useState<barDataItem[]>(dataSkeleton);

  /* 
    State variables for: 
      - Weekly attained values
      - Weekly goal values 
      - Weekly progress values 
  */
  const [weeklyValues, setWeeklyValues] = useState<number[]>([]);
  const [weekGoalValues, setWeekGoalValues] = useState<number[]>([7, 9, 30, 4]); // Arbitrary initial values
  const [progressValues, setProgressValues] = useState<number[]>([]);

  /* 
    State variables for: 
      - Daily values (distance & duration)
      - Daily value (distance & duration)
      - Highlighted day value 
  */
  const [dayValues, setDayValues] = useState<number[][]>([]);
  const [dailyDistanceValue, setDailyDistanceValue] = useState<number>(0);
  const [dailyDurationValue, setDailyDurationValue] = useState<number>(0);
  const [highlightedDay, setHighlightedDay] = useState<number>(0);

  /* 
    State variables for: 
      - Visibility of weekToggleModal
      - Authorization status of user 
      - Update flag that deals with triggering getWeekDetails() 
  */
  const [weekToggleModal, setWeekToggleModal] = useState<boolean>(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [update, setUpdate] = useState<boolean>(false);

  // On component mount, run getWeekDetails()
  // On update flag change, run getWeekDetails()
  useEffect(() => {
    getWeekDetails();
  }, [update]);

  const getWeekDetails = async (): Promise<void> => {
    try {
      showLoading();

      // weekStartDate is in UTC+0
      // It displays 4pm the previous day
      // Set minute to 1, so when backend converts to UTC+8, we get the correct day 00:01am
      const currentWeekStart: string = selectedWeek[0];
      const weekStartDate: Date = stringToDate(currentWeekStart);
      weekStartDate.setHours(0, 1, 0, 0);

      // weekEndDate is in UTC+0
      // It displays 4pm the previous day
      // Set hour to 23 and minute to 59, so it now displays 4pm today (maintaining the UTC+0)
      // When backend converts to UTC+8, we get the correct day 23:59pm
      const currentWeekEnd: string = selectedWeek[1];
      const weekEndDate: Date = stringToDate(currentWeekEnd);
      weekEndDate.setHours(23, 59, 0, 0);

      const token: string | null = await getToken("token");
      const response = await fetch(
        `${
          process.env.EXPO_PUBLIC_DOMAIN
        }strava_api/get_stats/?start_date=${weekStartDate.toISOString()}&end_date=${weekEndDate.toISOString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      // Invalid response
      if (!response.ok) {
        // User is not synced with Strava
        setIsAuthorized(false);
        return;
      }

      // Valid response
      // Extract out the values array
      const weekDetailsObject: WeekDetails = await response.json();
      const weekDetailsValues = Object.values(weekDetailsObject);

      // Grab the first 4 values for weekly stats
      const weeklyValues: number[] = weekDetailsValues.slice(0, 4);

      // Units coversion + 1dp rounding
      const totalDistanceValue: number = weeklyValues[2];
      weeklyValues[2] = metersToKilometers(totalDistanceValue);

      const totalDurationValue: number = weeklyValues[3];
      weeklyValues[3] = secondsToHours(totalDurationValue);
      setWeeklyValues(weeklyValues);

      // Calculate progress values for weekly stats
      const progressValuesResult: number[] = weeklyValues.map((num, index) =>
        calculateProgress(num, weekGoalValues[index])
      );
      setProgressValues(progressValuesResult);

      // Grab the last 2 values for daily stats
      const dailyValues: number[][] = weekDetailsValues.slice(4, 6);

      // Units conversion + 1dp rounding
      const dailyDistanceValues: number[] = dailyValues[0];
      dailyValues[0] = dailyDistanceValues.map(metersToKilometers);

      const dailyDurationValues: number[] = dailyValues[1];
      dailyValues[1] = dailyDurationValues.map(secondsToHours);
      setDayValues(dailyValues);

      // Update the barData
      // Note: Index maps to a particular day
      const updatedBarData = barData.map((item: any, index: number) => {
        const distanceThisDay: number = parseFloat(
          dailyValues[0][index].toFixed(1)
        );
        const durationThisDay: number = parseFloat(
          dailyValues[1][index].toFixed(1)
        );

        return {
          // This is necessary so that initially, we get a highlighted day
          label: (
            <Text
              style={index === highlightedDay ? styles.highlighted : undefined}
            >
              {indexToDayMap[index]}
            </Text>
          ),
          value: distanceThisDay,
          onPress: () => {
            setDailyDistanceValue(distanceThisDay);
            setDailyDurationValue(durationThisDay);
            handleHighlight(index);
          },
        };
      });

      // Set the initial daily value for both cells
      // Based on the highlighted day - either 0 or 1 - 6 (from an later/earlier week)
      setDailyDistanceValue(dailyValues[0][highlightedDay]);
      setDailyDurationValue(dailyValues[1][highlightedDay]);

      // @ts-ignore
      setBarData(updatedBarData);
      setIsAuthorized(true);

      // Catch other errors
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      hideLoading();
    }
  };

  /*
    Key idea:
      - Need to mutate barData to trigger a re-render of the barChart 
      - To do so, we need the most updated value of highlighted day 
      - Thus, we call setBarData within setHighlightedDay!! 
  */
  const handleHighlight = (index: number): void => {
    setHighlightedDay((prevHighlightedDay) => {
      setBarData((prevBarData: any) => {
        // Create a new array from the previous barData
        const newBarData = [...prevBarData];

        // Update the label of the newly highlighted day
        newBarData[index] = {
          ...newBarData[index],
          label: <Text style={styles.highlighted}>{indexToDayMap[index]}</Text>,
        };

        // Revert the label of the previously highlighted day
        // If currently highlighted day is different from prev highlighted day
        if (index != prevHighlightedDay) {
          newBarData[prevHighlightedDay] = {
            ...newBarData[prevHighlightedDay],
            label: <Text>{indexToDayMap[prevHighlightedDay]}</Text>,
          };
        }

        // Return the new array
        // To trigger a re-render
        return newBarData;
      });

      // Return the new highlighted day index to trigger a re-render
      return index;
    });
  };

  const handleGoBack = (): void => {
    const currentWeekStart: string = selectedWeek[0];
    const newWeekEnd: Date = stringToDate(currentWeekStart);
    newWeekEnd.setDate(newWeekEnd.getDate() - 1);

    const newWeekStart: Date = new Date(newWeekEnd);
    newWeekStart.setDate(newWeekStart.getDate() - 6);

    setSelectedWeek(getDates(newWeekStart, newWeekEnd));
    // Only when update variable has changed
    // Then we trigger the getWeekDetails() function
    // This ensures that the above thread has finished, and we don't use incorrect values
    setUpdate(!update);
  };

  const handleGoForward = (): void => {
    const currentWeekEnd: string = selectedWeek[1];

    // If currentWeekEnd matches the initialWeekEnd
    // Then we are at the initial (latest) week, we cannot go further
    if (currentWeekEnd == initialWeekEnd) {
      setWeekToggleModal(true);
      return;
    }

    const newWeekStart: Date = stringToDate(currentWeekEnd);
    newWeekStart.setDate(newWeekStart.getDate() + 1);

    const newWeekEnd: Date = new Date(newWeekStart);
    newWeekEnd.setDate(newWeekEnd.getDate() + 6);

    setSelectedWeek(getDates(newWeekStart, newWeekEnd));
    // Only when update variable has changed
    // Then we trigger the getWeekDetails() function
    // This ensures that the above thread has finished, and we don't use incorrect values
    setUpdate(!update);
  };

  return (
    <View style={globalStyles.container}>
      <ScrollView
        style={styles.contentWrapper}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.wrapperCommon}>
          <PageHeader
            topText="Summary"
            bottomText="Weekly Performance"
            topTextNoMarginTop={true}
          />
        </View>
        {isAuthorized && (
          <>
            <View style={[styles.statsWrapper, styles.wrapperCommon]}>
              <View style={styles.weekToggle}>
                <TouchableOpacity onPress={handleGoBack}>
                  <Ionicons
                    name="arrow-undo-outline"
                    size={25}
                    style={styles.leftArrow}
                  />
                </TouchableOpacity>

                <Text style={globalStyles.para}>
                  {selectedWeek[0] + " - " + selectedWeek[1]}
                </Text>

                <TouchableOpacity onPress={handleGoForward}>
                  <Ionicons
                    name="arrow-redo-outline"
                    size={25}
                    style={styles.rightArrow}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.stats}>
                <View style={styles.statsHalf}>
                  <View style={[styles.statsCell, styles.statsCellExtra]}>
                    <Text style={globalStyles.label}>Workouts:</Text>
                    <Text style={globalStyles.label}>
                      <Text style={styles.highlightedText}>
                        {progressValues[0] + "% "}
                      </Text>
                      progress
                    </Text>
                    <Ionicons
                      name="bicycle-outline"
                      size={35}
                      style={styles.statsIcon}
                    />
                    <ProgressBar
                      leftLabel={weeklyValues[0]}
                      rightLabel={weekGoalValues[0]}
                      progress={progressValues[0]}
                    />
                  </View>

                  <View style={styles.statsCell}>
                    <Text style={globalStyles.label}>Hours:</Text>
                    <Text style={globalStyles.label}>
                      <Text style={styles.highlightedText}>
                        {progressValues[3] + "% "}
                      </Text>
                      progress
                    </Text>
                    <Ionicons
                      name="time-outline"
                      size={35}
                      style={styles.statsIcon}
                    />
                    <ProgressBar
                      leftLabel={weeklyValues[3]}
                      rightLabel={weekGoalValues[3]}
                      progress={progressValues[3]}
                    />
                  </View>
                </View>

                <View style={styles.statsHalf}>
                  <View style={[styles.statsCell, styles.statsCellExtra]}>
                    <Text style={globalStyles.label}>Kilometers:</Text>
                    <Text style={globalStyles.label}>
                      <Text style={styles.highlightedText}>
                        {progressValues[2] + "% "}
                      </Text>
                      progress
                    </Text>
                    <Ionicons
                      name="flame-outline"
                      size={35}
                      style={styles.statsIcon}
                    />

                    <ProgressBar
                      leftLabel={weeklyValues[2]}
                      rightLabel={weekGoalValues[2]}
                      progress={progressValues[2]}
                    />
                  </View>

                  <View style={styles.statsCell}>
                    <Text style={globalStyles.label}>Achievements:</Text>
                    <Text style={globalStyles.label}>
                      <Text style={styles.highlightedText}>
                        {progressValues[1] + "% "}
                      </Text>
                      progress
                    </Text>
                    <Ionicons
                      name="rocket-outline"
                      size={35}
                      style={[styles.statsIcon, styles.statsIconExtra]}
                    />
                    <ProgressBar
                      leftLabel={weeklyValues[1]}
                      rightLabel={weekGoalValues[1]}
                      progress={progressValues[1]}
                    />
                  </View>
                </View>
              </View>
            </View>

            <View style={[styles.buttonsWrapper, styles.wrapperCommon]}>
              <SetGoalsModal
                setWeekGoalValues={setWeekGoalValues}
                setUpdate={setUpdate}
              />
            </View>

            <View style={styles.wrapperCommon}>
              <PageHeader topText="" bottomText="Weekly Mileage" />
              <View style={styles.barChart}>
                <BarChart
                  // General
                  data={barData}
                  width={screenWidth - 24} // Since padding of 12
                  hideRules
                  hideOrigin
                  // Handle y-axis
                  showYAxisIndices={false}
                  hideYAxisText
                  yAxisThickness={0}
                  yAxisLabelWidth={0}
                  // Handle x-axis
                  disableScroll
                  initialSpacing={0}
                  spacing={20}
                  // 24: Total horizontal padding
                  // 120: Total spacing across 7 bars
                  // 7: Split the remaining space across 7 bars
                  barWidth={(screenWidth - 24 - 120) / 7}
                  xAxisLength={screenWidth - 24}
                  parentWidth={screenWidth - 24}
                  //Styling
                  frontColor="#FBB3B3"
                  xAxisLabelTextStyle={globalStyles.label}
                  barBorderBottomLeftRadius={0}
                  barBorderBottomRightRadius={0}
                  barBorderRadius={7}
                />
              </View>
            </View>

            <View
              style={[styles.selectedDayStatsWrapper, styles.wrapperCommon]}
            >
              <View style={styles.statCell1}>
                <Text style={styles.topText}>{dailyDistanceValue}</Text>
                <Text style={styles.bottomText}>
                  {dailyDistanceValue == 1 ? "Kilometer" : "Kilometers"}
                </Text>
              </View>
              <View>
                <Text style={styles.topText}>{dailyDurationValue}</Text>
                <Text style={styles.bottomText}>
                  {dailyDurationValue == 1 ? "Hour" : "Hours"}
                </Text>
              </View>
            </View>

            <WeekToggleModal
              visibility={weekToggleModal}
              setVisibility={setWeekToggleModal}
            />
          </>
        )}

        {!isAuthorized && (
          <View style={styles.wrapperCommon}>
            <Text style={globalStyles.header}>Oops!</Text>
            <Text style={globalStyles.para}>
              You must log in and sync with Strava first before viewing your
              workout statistics!
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Main content wrapper: Horizontal padding of 10
  // All the direct child wrappers: Horizontal padding of 2
  // To prevent scrollview from cutting elements off horizontally
  contentWrapper: {
    // Top padding 0
    // So top of inner scrollable container of scrollview matches top of outer container
    // Then, marginTop 70 to push the both containers down
    marginTop: 70,
    paddingTop: 0,
    paddingBottom: 12,
    paddingHorizontal: 10,
  },

  wrapperCommon: {
    paddingHorizontal: 2,
  },

  statsWrapper: {
    marginTop: "-7%",
    height: 385,
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
    fontSize: 13,
  },

  statsIcon: {
    position: "relative",
    left: "77%",
    top: "5.5%",
  },

  statsIconExtra: {
    top: "6.5%",
  },

  buttonsWrapper: {
    marginBottom: "15%",
  },

  button: {
    width: "43%",
    backgroundColor: "#F6F2F2",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },

  buttonIcon: {
    position: "relative",
    left: 4,
  },

  barChart: {
    marginBottom: "10%",
    paddingHorizontal: 2,
    marginTop: -10,
  },

  selectedDayStatsWrapper: {
    marginTop: "-5%",
    marginBottom: "10%",
    flexDirection: "row",
  },

  statCell1: {
    marginRight: "7%",
  },

  topText: {
    ...globalStyles.header,
    fontSize: 16,
    marginBottom: -5,
  },

  bottomText: {
    ...globalStyles.para,
    lineHeight: 17,
  },

  highlighted: {
    color: "red",
  },
});
