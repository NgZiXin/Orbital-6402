import { Redirect } from "expo-router";

// Expo router first routes to this page
// This page then redirects to login page
const Index = () => {
 return <Redirect href="/login" />;
};
export default Index;