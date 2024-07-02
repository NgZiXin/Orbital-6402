import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { getItem } from "@/components/general/asyncStorage";

// Expo router first routes to this page (entry point)
// This page then redirects to login page
const Index = () => {
  const router = useRouter();

  // Check if authenticated
  useEffect(() => {
    getItem("token").then((item) => {
      item ? router.replace("/profile") : router.replace("/login");
    });
  }, []);
  
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};
export default Index;