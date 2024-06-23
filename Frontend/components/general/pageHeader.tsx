import { Text, View } from "react-native";
import { globalStyles } from "../../styles/global";

interface textTypes {
  topText: string | null;
  bottomText: string | null;
}

export default function PageHeader({ topText, bottomText }: textTypes) {
  return (
    <>
      <View style={{ width: "100%" }}>
        {topText != "" && (
          <Text
            style={{
              ...globalStyles.para,
              color: "red",
              fontFamily: "inter-bold",
            }}
          >
            {topText}
          </Text>
        )}
        {bottomText != "" && (
          <Text
            style={{
              ...globalStyles.header,
              fontFamily: "inter-bold",
              position: "relative",
              bottom: 20,
            }}
          >
            {bottomText}
          </Text>
        )}
      </View>
    </>
  );
}
