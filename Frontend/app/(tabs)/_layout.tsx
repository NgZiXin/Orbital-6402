import { Tabs, useNavigation } from "expo-router";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Platform, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import { getToken } from "@/utility/general/userToken";
import Header from "../../components/navigation/header";
import StravaSyncModal from "@/components/modal/general/stravaSync";
import StravaReSyncModal from "@/components/modal/general/stravaReSync";

export default function TabLayout() {
  const navigation = useNavigation();
  const [syncStrava, setSyncStrava] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("AUTHORIZED");
  const [stravaClientId, setStravaClientId] = useState<string>("");

  // Check if current user is synced with Strava
  const verify = async () => {
    try {

      // getItem('token') returns a Promise
      // Hence, we await to wait for the Promise to complete and grab its value
      const token: string | null = await getToken("token");

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_DOMAIN}strava_api/check_auth`,
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

      // Successful query
      // Extract client ID and sync status
      const data = await response.json();
      setStravaClientId(data["CLIENT_ID"]);
      setStatus(data["status"]);

      // Data processing
      if (
        data["status"] == "UNAUTHORIZED" ||
        data["status"] == "DEAUTHORIZED"
      ) {
        setSyncStrava(true);
      } else {
        setSyncStrava(false);
      }

      // Catch any errors
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Delay by 1000ms
    // So that there is time for initial setup before first run (on mount)
    // So that there is time for Strava to update sync status before re-run (if first run fails and triggers sync/re-sync)
    const timer = setTimeout(() => {
      verify(); // Comment this to disable Strava Sync
    }, 1000); // Set timer to improve UX by reducing race conditions

    return () => clearTimeout(timer);
  }, [syncStrava]);

  const screenOptions = () => {
    return {
      headerShown: true,
      headerTitle: () => {
        return <Header navigation={navigation} />;
      },
      headerStyle: styles.mainHeader,
      tabBarStyle: styles.tabBar,
      tabBarActiveTintColor: "red",
      tabBarInactiveTintColor: "black",
      tabBarLabel: "Home",
      tabBarLabelStyle:
        Platform.OS == "android" ? styles.androidLabel : styles.iosLabel,
    };
  };

  return (
    <View style={styles.mainContainer}>
      <Tabs screenOptions={screenOptions} backBehavior="history">
        {/* Profile at the top, so after login --> profile */}
        <Tabs.Screen
          name="profile"
          options={{
            // Hides it from tab bar
            // Nonetheless, route still exists
            // Routing to profile this way allows the bottom tab bar to be visible!
            href: null,
          }}
        />

        <Tabs.Screen
          name="runningRoute"
          options={{
            href: null,
          }}
        />

        <Tabs.Screen
          name="nearestGymPark"
          options={{
            href: null,
          }}
        />

        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                name={focused ? "home" : "home-outline"}
                color="black"
              />
            ),
            tabBarLabel: "Home",
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="location"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                name={focused ? "location" : "location-outline"}
                color="black"
              />
            ),
            tabBarLabel: "Location",
          }}
        />
        <Tabs.Screen
          name="workout"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                name={focused ? "flash" : "flash-outline"}
                color="black"
              />
            ),
            tabBarLabel: "Workouts",
          }}
        />
        <Tabs.Screen
          name="forum"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                name={focused ? "newspaper" : "newspaper-outline"}
                color="black"
              />
            ),
            tabBarLabel: "Forum",
            href: null, // Temporary
          }}
        />
      </Tabs>

      {status == "UNAUTHORIZED" ? (
        <StravaSyncModal
          visibility={syncStrava}
          setVisibility={setSyncStrava}
          stravaClientID={stravaClientId}
        />
      ) : status == "DEAUTHORIZED" ? (
        <StravaReSyncModal
          visibility={syncStrava}
          setVisibility={setSyncStrava}
          stravaClientID={stravaClientId}
        />
      ) : (
        <></>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainHeader: {
    height: 95,
    backgroundColor: "#E5E5E5",
  },

  tabBar: {
    backgroundColor: "#E5E5E5",
    height: 60,
  },

  androidLabel: {
    fontFamily: "inter-regular",
    fontSize: 10,
    // Ensure position type matches
    position: "relative" as "relative",
    bottom: 5,
  },

  iosLabel: {
    fontFamily: "inter-regular",
    fontSize: 10,
    position: "relative" as "relative",
    top: 15,
  },

  mainContainer: {
    flex: 1,
  },
});
