import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { getItem } from "@/components/general/asyncStorage";

// Expo router first routes to this page (entry point)
// This page then redirects to login page
const Index = () => {
  const [token, setToken] = useState<string | null>(null)
  // Check if authenticated
  useEffect(() => {getItem("token").then(item => setToken(item))},[])
  return token ? <Redirect href="/(tabs)/profile" /> : <Redirect href="/login" />;
};
export default Index;
