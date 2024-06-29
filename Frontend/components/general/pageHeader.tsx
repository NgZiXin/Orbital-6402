import { StyleSheet, Text, View } from "react-native";
import { globalStyles } from "../../styles/global";

interface PageHeaderProps {
  topText: string | null;
  bottomText: string | null;
  topTextNoMarginTop?: boolean;
}

export default function PageHeader({
  topText,
  bottomText,
  topTextNoMarginTop,
}: PageHeaderProps) {
  return (
    <>
      <View style={{ width: "100%" }}>
        {topText != "" && (
          <Text
            style={[
              styles.topTextStyle,
              topTextNoMarginTop ? styles.topTextExtra : undefined,
            ]}
          >
            {topText}
          </Text>
        )}
        {bottomText != "" && (
          <Text style={styles.bottomTextStyle}>{bottomText}</Text>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  topTextStyle: {
    ...globalStyles.para,
    color: "red",
    fontFamily: "inter-bold",
  },

  topTextExtra: {
    marginTop: 0,
  },

  bottomTextStyle: {
    ...globalStyles.header,
    fontFamily: "inter-bold",
    position: "relative",
    bottom: 20,
  },
});
