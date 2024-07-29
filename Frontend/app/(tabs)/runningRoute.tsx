import { WebView } from "react-native-webview";
import { globalStyles } from "@/styles/global";
import { useEffect, useState } from "react";
import { getToken } from "@/utility/general/userToken";


export default function RunningRoute() {
  const [token, setToken] = useState<string | null>(null);

  // On component mount, grab the user token string and store it
  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await getToken("token");
      setToken(storedToken);
    };

    fetchToken();
  }, []);

  return token ? (
    <WebView
      style={globalStyles.container}
      javaScriptEnabled={true}
      startInLoadingState={true}
      source={{
        uri: `${process.env.EXPO_PUBLIC_DOMAIN}map`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      }}
    />
  ) : (
    <></>
  );
}
