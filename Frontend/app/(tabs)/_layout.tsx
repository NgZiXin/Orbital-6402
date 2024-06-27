import { Tabs, useNavigation } from "expo-router";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Platform, View } from "react-native";
import Header from "../../components/navigation/header";

export default function TabLayout() {
  const navigation = useNavigation();

  const screenOptions = () => {
    let headerStyle = {
      height: 95,
      backgroundColor: "#E5E5E5",
    };
    return {
      tabBarActiveTintColor: "red",
      tabBarInactiveTintColor: "black",
      headerShown: true,
      headerTitle: () => {
        return <Header navigation={navigation} />;
      },
      headerStyle: headerStyle,
      tabBarStyle: {
        backgroundColor: "#E5E5E5",
        height: 60,
      },
      tabBarLabel: "Home",
      tabBarLabelStyle:
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
            },
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
    </View>
  );
}
