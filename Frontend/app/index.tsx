import { useRouter } from "expo-router";
import { useEffect } from "react";
import LoadingOverlay from "@/components/general/loadingOverlay";
import { getItem } from "@/components/general/asyncStorage";

// Expo router first routes to this page (entry point)
// This page then redirects to login page
const Index = () => {
  const router = useRouter();

  // Check if authenticated
  useEffect(() => {
    getItem("token").then((token) => {
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
              // Redirect to the login page
              router.replace("/login");
              return Promise.reject(new Error("Unauthorized"));
            }
            throw new Error("Network response was not ok");
          }
          router.replace("/profile");
        });
      } else {
        router.replace("/login");
      }
    });
  }, []);

  return <LoadingOverlay />;
};
export default Index;
