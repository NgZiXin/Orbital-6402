import { ScrollView, StyleSheet, Text, View, Image } from "react-native";
import { globalStyles } from "../../styles/global";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { getItem } from "../../components/general/asyncStorage";
import LinkStrava from "../../components/strava/LinkStrava";

import EditModal from "@/components/modal/profilePage/edit";
import LogoutModal from "@/components/modal/profilePage/logout";
import BmiModal from "@/components/modal/profilePage/bmi";
import SyncModal from "@/components/modal/profilePage/sync";

export default function Profile() {
  const [userDetails, setUserDetails] = useState<string[]>([]);
  const [age, setAge] = useState<number>(0);
  const [bmi, setBMI] = useState<number>(0.0);
  const [maxHR, setMaxHR] = useState<number>(0);

  // boolFlag1: interacts with edit
  // boolFlag2: interacts with processing
  const [boolFlag1, setBoolFlag1] = useState<boolean>(true);
  const [boolFlag2, setBoolFlag2] = useState<boolean>(true);

  // this function is called after closing the edit modal
  // it triggers getUserDetails()
  const triggerUpdate = () => {
    setBoolFlag1((prev) => !prev);
  };

  const getUserDetails = async () => {
    // getItem('token') returns a Promise
    // hence, we await to wait for the Promise to complete and grab its value
    const token: string | null = await getItem("token");

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_DOMAIN}accounts/data`,
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

    const dataObj = await response.json();
    const valuesArray: string[] = Object.values(dataObj).map(String);
    setUserDetails(valuesArray);
  };

  // getUserDetails() fetches the user data of the current user that's logged in
  // via the auth token stored under asyncStorage
  // the fetched user data is then stored under userDetails
  useEffect(() => {
    getUserDetails();
  }, [boolFlag1]);

  // when userDetail changes, effect function is invoked
  // it does a bunch of processing
  // then, it flips a boolean flag, triggering a ('final') re-render
  // in the mount - edit - submit - close process
  useEffect(() => {
    if (userDetails.length > 0) {
      // Conversion part
      // Change bday from YYYY-MM-DD to DD-MM-YYYY
      const initialBirthday = userDetails[4];
      const [year, month, day] = initialBirthday.split("-");
      const updatedBirthday = `${day}-${month}-${year}`;
      userDetails[4] = updatedBirthday;

      // Ensure height is 2dp
      const height: string = userDetails[2];
      const heightValue: number = parseFloat(height);
      const heightValueRounded: number =
        Math.round((heightValue + Number.EPSILON) * 100) / 100;
      userDetails[2] = heightValueRounded.toString();

      // Ensure weight is integer
      const weight: string = userDetails[3];
      const weightValue: number = parseFloat(weight);
      const weightValueRounded: number = Math.trunc(weightValue);
      userDetails[3] = weightValueRounded.toString();

      // Calculate age part
      const birthDate = new Date(initialBirthday);
      const currentDate = new Date();

      let userAge = currentDate.getFullYear() - birthDate.getFullYear();
      const monthDiff = currentDate.getMonth() - birthDate.getMonth();

      // If current month is before birth month OR in the same month but birth day is ahead of current day
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())
      ) {
        userAge--;
      }

      // Calculate BMI part
      // Formula: BMI = Weight (kg) / Height (m) square
      const userWeight = Number(userDetails[3]);
      const userHeight = Number(userDetails[2]);
      const userBMI = (userWeight * 1.0) / userHeight ** 2;

      // Calculate Max HR part
      // Formula: 220 - age
      const userMaxHR = 220 - userAge;

      setAge(userAge);
      // Formula to round BMI to 2dp
      setBMI(Math.round((userBMI + Number.EPSILON) * 100) / 100);
      setMaxHR(userMaxHR);

      setBoolFlag2(!boolFlag2);
    }
  }, [userDetails]);

  return (
    <ScrollView
      style={globalStyles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.bgWrapper}>
        <Image
          source={require("../../assets/images/bg-image.jpg")}
          style={styles.banner}
        />
      </View>

      <View style={styles.profileWrapper}>
        {/* 
            When userDetails is populated 
            After the async getUserDetails function finishes
            Then only, is this component rendered
            This same idea is repeated multiple times below! 
          */}
        {/* Gender is found at index 5 of the array */}
        {userDetails.length > 0 && userDetails[5] == "F" && (
          <Image
            source={require("../../assets/images/female-pfp.jpg")}
            style={styles.pfp}
          />
        )}

        {userDetails.length > 0 && userDetails[5] == "M" && (
          <Image
            source={require("../../assets/images/male-pfp.png")}
            style={styles.pfp}
          />
        )}

        {userDetails.length > 0 && (
          <View style={{ height: "15%", marginBottom: -8 }}>
            <Text style={styles.userName}>
              {/* Username is found at index 1 of the array */}
              {userDetails[1] + " (" + userDetails[5] + ")"}
            </Text>

            {/* Change name to two parter in future */}
            {/* <Text>Tom </Text>  
              <Text style={{color: 'red'}}>Hanks</Text> */}
          </View>
        )}

        <View style={styles.iconWrapper}>
          <EditModal triggerUpdate={triggerUpdate} />
          <LogoutModal />
        </View>

        <View style={styles.detailsWrapper}>
          <View style={styles.merged}>
            <View style={globalStyles.cardV1}>
              {userDetails.length > 0 && (
                <View style={styles.cardInner}>
                  <Text style={styles.header}>Height:</Text>
                  {/* Height is found at index 2 of the array */}
                  <Text style={styles.para}>{userDetails[2] + "m"}</Text>
                </View>
              )}
            </View>
            <View style={globalStyles.cardV1}>
              {userDetails.length > 0 && (
                <View style={styles.cardInner}>
                  <Text style={styles.header}>Weight:</Text>
                  {/* Weight is found at index 3 of the array */}
                  <Text style={styles.para}>{userDetails[3] + "kg"}</Text>
                </View>
              )}
            </View>
            <View style={globalStyles.cardV1}>
              {userDetails.length > 0 && (
                <View style={styles.cardInner}>
                  <Text style={styles.header}>Birthday:</Text>
                  {/* Birthday is found at index 4 of the array */}
                  <Text style={styles.para}>{userDetails[4]}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.merged}>
            <View style={globalStyles.cardV1}>
              {userDetails.length > 0 && (
                <View style={styles.cardInner}>
                  <Text style={styles.header}>Age:</Text>
                  <Text style={styles.para}>{age}</Text>
                </View>
              )}
            </View>
            <View style={globalStyles.cardV1}>
              {userDetails.length > 0 && (
                <View style={styles.cardInner}>
                  <View style={styles.infoWrapper}>
                    <Text style={styles.header}>BMI: </Text>
                    <BmiModal />
                  </View>
                  <Text style={styles.para}>{bmi}</Text>
                </View>
              )}
            </View>
            <View style={globalStyles.cardV1}>
              {userDetails.length > 0 && (
                <View style={styles.cardInner}>
                  <Text style={styles.header}>Max HR:</Text>
                  <Text style={styles.para}>{maxHR + "bpm"}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>

      <View style={styles.stravaWrapper}>
        <View style={styles.infoWrapper}>
          <Text>
            <Text style={styles.userName}>Strava </Text>
            <Text style={{ ...styles.userName, ...styles.accent }}>Sync</Text>
          </Text>
          <SyncModal />
        </View>

        <View style={styles.authCode}>
          <View style={globalStyles.cardV1}>
            <View style={{ padding: 10 }}>
              <Text style={globalStyles.para}>
                This will display the authCode when the sync button is pressed!
              </Text>
            </View>
          </View>
        </View>
        <SafeAreaView style={{ width: "100%" }}>
          <LinkStrava />
        </SafeAreaView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bgWrapper: {
    height: "18%",
  },

  banner: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "cover",
  },

  profileWrapper: {
    height: "37%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -150,
    marginBottom: "35%",
  },

  pfp: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    borderRadius: 150 / 2,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "red",
  },

  userName: {
    fontFamily: "inter-bold",
    fontSize: 16,
    marginTop: 10,
    paddingBottom: 5,
  },

  iconWrapper: {
    marginTop: "2%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  detailsWrapper: {
    marginTop: "-37%",
    width: "100%",
    height: "35%",
    flexDirection: "row",
  },

  merged: {
    marginTop: "40%",
    width: "50%",
    height: "100%",
  },

  header: {
    ...globalStyles.header,
  },

  para: {
    ...globalStyles.para,
    position: "relative",
    top: -16,
  },

  cardInner: {
    height: "75%",
    paddingHorizontal: 10,
  },

  infoWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },

  stravaWrapper: {
    marginTop: 145,
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  accent: {
    color: "red",
  },

  authCode: {
    width: "100%",
    paddingBottom: 10,
  },

  syncButton: {
    width: "100%",
    marginTop: "-5%",
    padding: 5,
    borderRadius: 15,
    backgroundColor: "#FFC4C4",
  },
});
