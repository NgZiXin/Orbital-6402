import { useRouter } from "expo-router";
import { useEffect } from "react";
import { getToken } from "@/utility/general/userToken";
import * as SplashScreen from "expo-splash-screen";
import Login from "./login";

// Expo router first routes to this page (entry point)
// This page then redirects to login page
const Index = () => {
  const router = useRouter();

  // Check if authenticated
  useEffect(() => {
    getToken("token")
      .then((token) => {
        // Check if token is valid
        if (token) {
          fetch(`${process.env.EXPO_PUBLIC_DOMAIN}accounts/ping`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
          }).then((response) => {
            if (!response.ok) {
              if (response.status === 401) {
                return Promise.reject(new Error("Unauthorized"));
              }
              throw new Error("Network response was not ok");
            }
            router.replace("/profile");
          });
        }
      })
      .finally(() => {
        setTimeout(SplashScreen.hideAsync, 1000); // Set Timeout to improve UX. DO NOT CLEAR TIMEOUT
      });
  }, []);

  return <Login />;
};

export default Index;
