import { Platform, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { type IconProps } from '@expo/vector-icons/build/createIconSet';
import { type ComponentProps } from 'react';

export function TabBarIcon({ style, ...rest }: IconProps<ComponentProps<typeof Ionicons>['name']>) {
  const active = Platform.OS
  return <Ionicons size={28} style={[{ marginBottom: -3}, style, active=="ios" ? styles.iosStyle : undefined]} {...rest} />;
}

const styles = StyleSheet.create({
  iosStyle: {
    marginTop: -6,
    position: 'relative',
    top: 10
  }
})