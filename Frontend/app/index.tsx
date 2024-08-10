import { useRouter } from "expo-router";
import { useEffect } from "react";
import { getToken } from "@/utility/general/userToken";
import * as SplashScreen from "expo-splash-screen";

// Expo router first routes to this page (entry point)
// This page then redirects to login page
const Index = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getToken("token");
        if (token) {
          const response = await fetch(
            `${process.env.EXPO_PUBLIC_DOMAIN}accounts/ping`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
              },
            }
          );
          if (!response.ok) {
            // Either unauthorized or network error
            router.replace("/login");
            return;
          }
          // Authenticated
          router.replace("/profile");
        } else {
          // No token found
          router.replace("/login");
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        router.replace("/login");
      } finally {
        await SplashScreen.hideAsync(); // Hide splash screen after operations
      }
    };

    checkAuth();
  }, [router]);

  return null; // Return null to avoid rendering anything
};

export default Index;
