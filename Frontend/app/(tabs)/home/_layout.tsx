import HomeHeader from "@/components/navigation/homeHeader";
import { Tabs, useNavigation } from "expo-router";
import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { ViewStyle } from "react-native";

export default function HomeLayout() {
  const navigation = useNavigation();

  const screenOptions:
    | BottomTabNavigationOptions
    | ((props: { route: any }) => BottomTabNavigationOptions) = ({ route }) => {
    let headerStyle = { height: 95, backgroundColor: "#E5E5E5" };
    let tabBarStyle: ViewStyle = { display: "none" };
    return {
      headerShown: true,
      headerTitle: () => {
        return <HomeHeader navigation={navigation} route={route} />;
      },
      headerStyle: headerStyle,
      tabBarStyle: tabBarStyle,
    };
  };

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen name="stats" options={{ href: null }} />
      <Tabs.Screen name="calendar" options={{ href: null }} />
    </Tabs>
  );
}
