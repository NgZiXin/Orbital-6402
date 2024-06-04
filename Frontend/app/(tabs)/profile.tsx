import {
  Platform,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Card from "../../utility/card";
import { globalStyles } from "../../styles/global";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import EditForm from "../../utility/edit";
import { Link } from "expo-router";
import { getItem } from "../../utility/asyncStorage";
import { REACT_APP_DOMAIN } from "@env";

export default function Profile() {
  // state variables to track modal state
  const [editModal, setEditModal] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const [bmiModal, setBMIModal] = useState(false);
  const [syncModal, setSyncModal] = useState(false);

  // state variable to track user profile details
  const [userDetails, setUserDetails] = useState<[string, any][]>([]);

  const submitHandler = () => {
    setEditModal(false);
  };

  const getUserDetails = async () => {
    // getItem('token') returns a Promise
    // hence, we await to wait for the Promise to complete and grab its value
    const token: string | null = await getItem("token");

    const response = await fetch(
      `http://${REACT_APP_DOMAIN}:8000/accounts/data`,
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

    const data = await response.json();
    const arrVersion = Object.entries(data);
    setUserDetails(arrVersion);
  };

  // trigger only when userDetails array is unpoplated
  if (userDetails.length === 0) {
    getUserDetails();
  }

  // converting birthday from 'YYYY-MM-DD' to 'DD-MM-YYYY' format
  // technical note: once the userDetails is populated, a re-rendered is triggered
  // this part comes before the display below
  // ensuring display is always correct
  if (userDetails.length > 0) {
    const initialBirthday: string = userDetails[4][1];
    const [year, month, day] = initialBirthday.split("-");
    const updatedBirthday: string = `${day}-${month}-${year}`;
    userDetails[4][1] = updatedBirthday;
  }

  function renderEditModal() {
    return (
      <Modal animationType="fade" visible={editModal} transparent={true}>
        <View style={styles.modalWrapper}>
          <View style={{ ...styles.modalContent, height: "79%" }}>
            <KeyboardAvoidingView
              style={globalStyles.container}
              keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
              behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
              <View style={{ width: "100%", height: "100%" }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={globalStyles.header}>Edit Account Details</Text>
                  <TouchableOpacity onPress={() => setEditModal(false)}>
                    <Ionicons name="close-circle-outline" size={25}></Ionicons>
                  </TouchableOpacity>
                </View>
                <EditForm submitHandler={submitHandler} />
              </View>
            </KeyboardAvoidingView>
          </View>
        </View>
      </Modal>
    );
  }

  function renderLogoutModal() {
    return (
      <Modal animationType="fade" visible={logoutModal} transparent={true}>
        <View style={styles.modalWrapper}>
          <View style={styles.modalContent}>
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Text style={globalStyles.header}>Confirmation</Text>
              <Text style={globalStyles.para}>
                Are you sure you want to log out / change accounts?
              </Text>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-around",
                }}
              >
                <Link
                  href="./profile"
                  style={styles.commonButton}
                  onPress={() => setLogoutModal(false)}
                >
                  No
                </Link>
                <Link
                  href="../login"
                  style={styles.commonButton}
                  onPress={() => setLogoutModal(false)}
                >
                  Yes
                </Link>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  function renderBMIModal() {
    return (
      <Modal animationType="fade" visible={bmiModal} transparent={true}>
        <View style={styles.modalWrapper}>
          <View style={styles.modalContent}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={globalStyles.header}>Body Mass Index (BMI)</Text>
              <TouchableOpacity onPress={() => setBMIModal(false)}>
                <Ionicons name="close-circle-outline" size={25}></Ionicons>
              </TouchableOpacity>
            </View>

            <ScrollView>
              <Text
                style={{
                  ...globalStyles.para,
                  position: "relative",
                  bottom: 10,
                }}
              >
                BMI is an estimate of body fat based on height and weight. It
                can help determine whether a person is at an unhealthy or
                healthy weight. However, it is not without its limitations.
              </Text>
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(
                    "https://www.healthline.com/health/body-mass-index#Body-Mass-Index-for-Adults"
                  )
                }
              >
                <Text style={{ ...globalStyles.para, color: "red" }}>
                  Click me to learn more!
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }

  function renderSyncModal() {
    return (
      <Modal animationType="fade" visible={syncModal} transparent={true}>
        <View style={styles.modalWrapper}>
          <View style={styles.modalContent}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={globalStyles.header}>Strava Sync</Text>
              <TouchableOpacity onPress={() => setSyncModal(false)}>
                <Ionicons name="close-circle-outline" size={25}></Ionicons>
              </TouchableOpacity>
            </View>

            <ScrollView>
              <Text
                style={{
                  ...globalStyles.para,
                  position: "relative",
                  bottom: 10,
                }}
              >
                Log in to your Strava account, and go to the settings page. Use
                the authorization code displayed below to sync with your Strava
                account!
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <View style={globalStyles.container}>
      {renderEditModal()}
      {renderLogoutModal()}
      {renderBMIModal()}
      {renderSyncModal()}

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
              source={require("../../assets/images/female-pfp.png")}
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
            <TouchableOpacity onPress={() => setEditModal(true)}>
              <Ionicons name="create-outline" size={25} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setLogoutModal(true)}>
              <Ionicons
                name="log-out-outline"
                size={25}
                style={{ ...styles.icon, marginBottom: -2 }}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.detailsWrapper}>
            <View style={styles.merged}>
              <Card>
                {userDetails.length > 0 && (
                  <View style={styles.cardWrapper}>
                    <Text style={styles.header}>Height:</Text>
                    {/* Height is found at index 2 of the array */}
                    <Text style={styles.para}>{userDetails[2][1] + "m"}</Text>
                  </View>
                )}
              </Card>
              <Card>
                {userDetails.length > 0 && (
                  <View style={styles.cardWrapper}>
                    <Text style={styles.header}>Weight:</Text>
                    {/* Weight is found at index 3 of the array */}
                    <Text style={styles.para}>{userDetails[3][1] + "kg"}</Text>
                  </View>
                )}
              </Card>
              <Card>
                {userDetails.length > 0 && (
                  <View style={styles.cardWrapper}>
                    <Text style={styles.header}>Birthday:</Text>
                    {/* Birthday is found at index 4 of the array */}
                    <Text style={styles.para}>{userDetails[4][1]}</Text>
                  </View>
                )}
              </Card>
            </View>

            <View style={styles.merged}>
              <Card>
                <View style={styles.cardWrapper}>
                  <Text style={styles.header}>Age:</Text>
                  <Text style={styles.para}>22</Text>
                </View>
              </Card>
              <Card>
                <View style={styles.cardWrapper}>
                  <View style={styles.infoWrapper}>
                    <Text style={styles.header}>BMI: </Text>
                    <TouchableOpacity onPress={() => setBMIModal(true)}>
                      <Ionicons
                        name="information-circle-outline"
                        size={18}
                        color="red"
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.para}>22.9</Text>
                </View>
              </Card>
              <Card>
                <View style={styles.cardWrapper}>
                  <Text style={styles.header}>Max HR:</Text>
                  <Text style={styles.para}>198bpm</Text>
                </View>
              </Card>
            </View>
          </View>
        </View>

        <View style={styles.stravaWrapper}>
          <View style={styles.infoWrapper}>
            <Text>
              <Text style={styles.userName}>Strava </Text>
              <Text style={{ ...styles.userName, ...styles.accent }}>Sync</Text>
            </Text>
            <TouchableOpacity onPress={() => setSyncModal(true)}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="red"
                style={{ position: "relative", left: 5, top: 1.8 }}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.authCode}>
            <Card>
              <View style={{ padding: 10 }}>
                <Text style={globalStyles.para}>
                  This will display the authCode when the sync button is
                  pressed!
                </Text>
              </View>
            </Card>
          </View>

          <SafeAreaView style={{ width: "100%" }}>
            <TouchableWithoutFeedback onPress={displayAuth}>
              <View style={styles.syncButton}>
                <Text
                  style={{
                    ...globalStyles.header,
                    letterSpacing: 0,
                    textAlign: "center",
                  }}
                >
                  Sync with Strava!
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </SafeAreaView>
        </View>
      </ScrollView>
    </View>
  );
}

// TODO in future
const displayAuth = () => {
  console.log("Placeholder");
};

const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalContent: {
    backgroundColor: "white",
    padding: 15,
    width: "80%",
    height: 200,
    borderRadius: 10,
  },

  commonButton: {
    width: "45%",
    textAlign: "center",
    borderRadius: 15,
    backgroundColor: "#FFC4C4",
    ...globalStyles.header,
    fontSize: 12,
    paddingVertical: 8,
  },

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

  icon: {
    paddingHorizontal: 15,
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

  cardWrapper: {
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
