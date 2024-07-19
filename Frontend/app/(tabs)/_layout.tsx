import { Tabs, useNavigation } from "expo-router";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Platform, View } from "react-native";
import { useLoading } from "@/hooks/useLoading";
import { useEffect, useState } from "react";
import { getItem } from "@/components/general/asyncStorage";
import Header from "../../components/navigation/header";
import StravaSyncOverlay from "@/components/general/stravaSyncOverlay";
import StravaReSyncOverlay from "@/components/general/stravaReSyncOverlay";

export default function TabLayout() {
  const { showLoading, hideLoading } = useLoading();
  const navigation = useNavigation();
  const [syncStrava, setSyncStrava] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("AUTHORIZED");
  const [stravaClientId, setStravaClientId] = useState<string>("");

  const closeSyncStrava = () => {
    setSyncStrava(false);
  };

  const verify = async () => {
    try {
      showLoading();

      // getItem('token') returns a Promise
      // hence, we await to wait for the Promise to complete and grab its value
      const token: string | null = await getItem("token");

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
      const data = await response.json();

      setStravaClientId(data["CLIENT_ID"]);
      setStatus(data["status"]);
      if (
        data["status"] == "UNAUTHORIZED" ||
        data["status"] == "DEAUTHORIZED"
      ) {
        setSyncStrava(true);
      } else {
        setSyncStrava(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    // Verify if user is synced with Strava
    const timer = setTimeout(() => {
      verify();
    }, 1000); // Set timer to improve UX by reducing race conditions

    return () => clearTimeout(timer);
  }, [syncStrava]);

  const screenOptions = () => {
    let headerStyle = {
      height: 95,
      backgroundColor: "#E5E5E5",
    };

    let tabBarStyle = { backgroundColor: "#E5E5E5", height: 60 };
    let tabBarLabelStyle =
      Platform.OS == "android"
        ? {
            fontFamily: "inter-regular",
            fontSize: 10,
            // ensure position type matches
            position: "relative" as "relative",
            bottom: 5,
          }
        : {
            fontFamily: "inter-regular",
            fontSize: 10,
            position: "relative" as "relative",
            top: 15,
          };

    return {
      headerShown: true,
      headerTitle: () => {
        return <Header navigation={navigation} />;
      },
      headerStyle: headerStyle,
      tabBarStyle: tabBarStyle,
      tabBarActiveTintColor: "red",
      tabBarInactiveTintColor: "black",
      tabBarLabel: "Home",
      tabBarLabelStyle: tabBarLabelStyle,
    };
  };

  return (
    <View style={{ flex: 1 }}>
      <Tabs screenOptions={screenOptions}>
        <Tabs.Screen
          name="profile"
          options={{
            // After login --> profile
            // So can sync strava

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
          }}
        />
      </Tabs>
      {status == "UNAUTHORIZED" ? (
        <StravaSyncOverlay
          syncStrava={syncStrava}
          closeSyncStrava={closeSyncStrava}
          stravaClientId={stravaClientId}
        />
      ) : status == "DEAUTHORIZED" ? (
        <StravaReSyncOverlay
          syncStrava={syncStrava}
          closeSyncStrava={closeSyncStrava}
          stravaClientId={stravaClientId}
        />
      ) : (
        <></>
      )}
    </View>
  );
}
