import { ScrollView, StyleSheet, Text, View, Image } from "react-native";
import { globalStyles } from "../../styles/global";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { getItem } from "../../utility/asyncStorage";
import LinkStrava from "../../components/LinkStrava";

import {
  EditModal,
  LogoutModal,
  BmiModal,
  SyncModal,
} from "../../utility/modalComponents/index";
// import { REACT_APP_DOMAIN } from "@env";

export default function Profile() {
  const [userDetails, setUserDetails] = useState<[string, any][]>([]);

  const [updateCount, setUpdateCount] = useState<number>(0);
  const [bool, setBool] = useState<boolean>(true);

  // this function is called after closing the edit modal
  // it triggers getUserDetails()
  const triggerUpdate = () => {
    setUpdateCount((prev) => prev + 1);
  };

  const getUserDetails = async () => {
    // getItem('token') returns a Promise
    // hence, we await to wait for the Promise to complete and grab its value
    const token: string | null = await getItem("token");
    const ip = process.env.EXPO_PUBLIC_DOMAIN;
    const response = await fetch(`http://${ip}:8000/accounts/data`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const arrayVersion = Object.entries(data);

    setUserDetails(arrayVersion);
  };

  // getUserDetails() fetches the user data of the current user that's logged in
  // via the auth token stored under asyncStorage
  // the fetched user data is then stored under userDetails
  useEffect(() => {
    getUserDetails();
  }, [updateCount]);

  // when userDetail changes, effect function is invoked
  // it converts birthday from YYYYY-MM-DD to DD-MM-YYYY
  // then, it flips a boolean flag, triggering a ('final') re-render
  // in the mount - edit - submit - close process
  useEffect(() => {
    if (userDetails.length > 0) {
      const initialBirthday: string = userDetails[4][1];
      const [year, month, day] = initialBirthday.split("-");
      const updatedBirthday: string = `${day}-${month}-${year}`;
      userDetails[4][1] = updatedBirthday;
      setBool(!bool);
    }
  }, [userDetails]);

  return (
    <View style={globalStyles.container}>
      <ScrollView style={styles.scroll}>
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
          {userDetails.length > 0 && userDetails[5][1] == "F" && (
            <Image
              source={require("../../assets/images/female-pfp.jpg")}
              style={styles.pfp}
            />
          )}

          {userDetails.length > 0 && userDetails[5][1] == "M" && (
            <Image
              source={require("../../assets/images/male-pfp.png")}
              style={styles.pfp}
            />
          )}

          {userDetails.length > 0 && (
            <View style={{ height: "15%", marginBottom: -8 }}>
              <Text style={styles.userName}>
                {/* Username is found at index 1 of the array */}
                {userDetails[1][1] + " (" + userDetails[5][1] + ")"}
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
                    <Text style={styles.para}>{userDetails[2][1] + "m"}</Text>
                  </View>
                )}
              </View>
              <View style={globalStyles.cardV1}>
                {userDetails.length > 0 && (
                  <View style={styles.cardInner}>
                    <Text style={styles.header}>Weight:</Text>
                    {/* Weight is found at index 3 of the array */}
                    <Text style={styles.para}>{userDetails[3][1] + "kg"}</Text>
                  </View>
                )}
              </View>
              <View style={globalStyles.cardV1}>
                {userDetails.length > 0 && (
                  <View style={styles.cardInner}>
                    <Text style={styles.header}>Birthday:</Text>
                    {/* Birthday is found at index 4 of the array */}
                    <Text style={styles.para}>{userDetails[4][1]}</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.merged}>
              <View style={globalStyles.cardV1}>
                <View style={styles.cardInner}>
                  <Text style={styles.header}>Age:</Text>
                  <Text style={styles.para}>22</Text>
                </View>
              </View>
              <View style={globalStyles.cardV1}>
                <View style={styles.cardInner}>
                  <View style={styles.infoWrapper}>
                    <Text style={styles.header}>BMI: </Text>
                    <BmiModal />
                  </View>
                  <Text style={styles.para}>22.9</Text>
                </View>
              </View>
              <View style={globalStyles.cardV1}>
                <View style={styles.cardInner}>
                  <Text style={styles.header}>Max HR:</Text>
                  <Text style={styles.para}>198bpm</Text>
                </View>
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
                  This will display the authCode when the sync button is
                  pressed!
                </Text>
              </View>
            </View>
          </View>
          <SafeAreaView style={{ width: "100%" }}>
            <LinkStrava />
          </SafeAreaView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    // why tf does this work??
    marginBottom: -30,
  },

  bgWrapper: {
    width: "100%",
    height: "18%",
  },

  banner: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "cover",
  },

  profileWrapper: {
    width: "100%",
    height: "37%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "-37%",
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
    marginTop: "38%",
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
