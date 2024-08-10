import { ScrollView, StyleSheet, Text, View, Image } from "react-native";
import { globalStyles } from "../../styles/global";
import { useState, useEffect } from "react";
import { getToken } from "../../utility/general/userToken";
import { useLoading } from "@/hooks/useLoading";
import Card from "@/components/general/card";
import EditModal from "@/components/modal/profilePage/edit";
import LogoutModal from "@/components/modal/profilePage/logout";
import BmiModal from "@/components/modal/profilePage/bmi";

import {
  processBirthday,
  processHeight,
  processWeight,
  processAge,
  processBMI,
  processMaxHR,
} from "@/utility/profile/dataProcessing";

export default function Profile() {
  const { showLoading, hideLoading } = useLoading();
  const [userDetails, setUserDetails] = useState<string[]>([]);
  const [age, setAge] = useState<number>(0);
  const [bmi, setBMI] = useState<number>(0.0);
  const [maxHR, setMaxHR] = useState<number>(0);
  const [containerHeight, setContainerHeight] = useState<number>(-1);

  // editFlag: Deals with user detail edit
  // dataFlag: Deals with data processing
  const [editFlag, setEditFlag] = useState<boolean>(true);
  const [dataFlag, setDataFlag] = useState<boolean>(true);

  // This function is called after closing the edit modal
  const triggerUpdate = () => {
    setEditFlag((prev) => !prev);
  };

  // It then triggers getUserDetails()
  // On mount also!
  useEffect(() => {
    getUserDetails();
  }, [editFlag]);

  // Gets user details from backend database
  const getUserDetails = async () => {
    try {
      showLoading();

      // getItem('token') returns a Promise
      // Hence, we await to wait for the Promise to complete and grab its value
      const token: string | null = await getToken("token");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_DOMAIN}accounts/detail`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Successful response
      // Extract out values
      const dataObj = await response.json();
      const valuesArray: string[] = Object.values(dataObj).map(String);

      // Begin data processing
      processUserDetails(valuesArray);

      // Catch any errors
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      hideLoading();
    }
  };

  const processUserDetails = (userDetails: string[]) => {
    if (userDetails.length > 0) {
      // Converts bday from YYYY-MM-DD to DD-MM-YYYY
      const initialBirthday = userDetails[4];
      const updatedBirthday = processBirthday(initialBirthday);
      userDetails[4] = updatedBirthday;

      // Ensure height is 2dp
      const height: string = userDetails[2];
      const updatedHeight = processHeight(height);
      userDetails[2] = updatedHeight;

      // Ensure weight is integer
      const weight: string = userDetails[3];
      const updatedWeight = processWeight(weight);
      userDetails[3] = updatedWeight;

      // Calculate age
      const userAge = processAge(initialBirthday);

      // Calculate BMI
      const userBMI = processBMI(height, weight);

      // Calculate Max HR
      const userMaxHR = processMaxHR(userAge);

      // Write in the calculated values for age, BMI and max HR
      // Write in the updated userDetails
      setUserDetails(userDetails);
      setAge(userAge);
      setBMI(userBMI);
      setMaxHR(userMaxHR);

      // Toggles the data flag
      // Signalling the end of data processing
      // Triggers re-render with updated values
      setDataFlag(!dataFlag);
    }
  };

  // Grabs the avaliable height (excluding top header and bottom tab bar)
  const handleLayout = (e: any) => {
    e.persist();
    const { height } = e.nativeEvent.layout;

    // Only sets once initially (when default value is -1)
    if (containerHeight < 0) {
      setContainerHeight(height);
    }
  };

  return (
    <>
      {userDetails.length == 0 ? (
        <></>
      ) : (
        <ScrollView
          style={globalStyles.container}
          // ScrollView has two parts: Outer view (fixed) + Inner scrollable container (variable)
          // Sets height of scrollable container
          contentContainerStyle={{ height: containerHeight }}
          showsVerticalScrollIndicator={false}
          onLayout={handleLayout}
        >
          <View style={styles.bannerWrapper}>
            <Image
              source={require("../../assets/images/bg-image.jpg")}
              style={styles.banner}
            />
          </View>

          <View style={styles.profileWrapper}>
            {/* Gender is found at index 5 of the array */}
            {userDetails[5] == "F" && (
              <Image
                source={require("../../assets/images/female-pfp.jpg")}
                style={styles.profilePicture}
              />
            )}

            {userDetails[5] == "M" && (
              <Image
                source={require("../../assets/images/male-pfp.png")}
                style={styles.profilePicture}
              />
            )}

            <Text style={styles.userName}>
              {/* Username is found at index 1 of the array */}
              {userDetails[1] + " (" + userDetails[5] + ")"}
            </Text>

            <View style={styles.iconWrapper}>
              <EditModal triggerUpdate={triggerUpdate} />
              <LogoutModal />
            </View>

            <View style={styles.detailsWrapper}>
              <View style={styles.detailsHalf}>
                <Card
                  outerStyle={globalStyles.cardV1}
                  innerStyle={styles.cardInner}
                >
                  <Text style={globalStyles.header}>Height:</Text>
                  {/* Height is found at index 2 of the array */}
                  <Text style={styles.para}>{userDetails[2] + "m"}</Text>
                </Card>

                <Card
                  outerStyle={globalStyles.cardV1}
                  innerStyle={styles.cardInner}
                >
                  <Text style={globalStyles.header}>Weight:</Text>
                  {/* Weight is found at index 3 of the array */}
                  <Text style={styles.para}>{userDetails[3] + "kg"}</Text>
                </Card>

                <Card
                  outerStyle={globalStyles.cardV1}
                  innerStyle={styles.cardInner}
                >
                  <Text style={globalStyles.header}>Birthday:</Text>
                  {/* Birthday is found at index 4 of the array */}
                  <Text style={styles.para}>{userDetails[4]}</Text>
                </Card>
              </View>

              <View style={styles.detailsHalf}>
                <Card
                  outerStyle={globalStyles.cardV1}
                  innerStyle={styles.cardInner}
                >
                  <Text style={globalStyles.header}>Age:</Text>
                  <Text style={styles.para}>{age}</Text>
                </Card>

                <Card
                  outerStyle={globalStyles.cardV1}
                  innerStyle={styles.cardInner}
                >
                  <View style={styles.infoWrapper}>
                    <Text style={globalStyles.header}>BMI: </Text>
                    <BmiModal />
                  </View>
                  <Text style={styles.para}>{bmi}</Text>
                </Card>

                <Card
                  outerStyle={globalStyles.cardV1}
                  innerStyle={styles.cardInner}
                >
                  <Text style={globalStyles.header}>Max HR:</Text>
                  <Text style={styles.para}>{maxHR + "bpm"}</Text>
                </Card>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  bannerWrapper: {
    height: "21%",
  },

  banner: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "cover",
  },

  profileWrapper: {
    height: "82%",
    flexDirection: "column",
    alignItems: "center",

    // Move up by half the width
    // So that end of banner aligns exactly with midpoint of picture
    marginTop: -75,
  },

  profilePicture: {
    width: 150,
    height: 150,
    borderWidth: 1.5,
    borderColor: "red",

    // Creates a circular effect
    borderRadius: 150 / 2,
    resizeMode: "contain",
    overflow: "hidden",
  },

  userName: {
    fontFamily: "inter-bold",
    fontSize: 16,
    marginTop: 10,
    paddingBottom: 2,
  },

  iconWrapper: {
    marginTop: "1%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "3%",
  },

  detailsWrapper: {
    flexDirection: "row",
  },

  detailsHalf: {
    width: "48%",
  },

  para: {
    ...globalStyles.para,
    marginBottom: 3,
    position: "relative",
    top: -16,
  },

  cardInner: {
    paddingHorizontal: 10,
  },

  infoWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
});
