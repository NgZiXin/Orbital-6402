import { StyleProp, View, ViewStyle } from "react-native";

interface CardProps {
  outerStyle: StyleProp<ViewStyle>;
  innerStyle: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export default function Card({ outerStyle, innerStyle, children }: CardProps) {
  return (
    <>
      <View style={outerStyle}>
        <View style={innerStyle}>{children}</View>
      </View>
    </>
  );
}
