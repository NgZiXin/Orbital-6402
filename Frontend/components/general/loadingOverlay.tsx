import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useLoading } from "@/hooks/useLoading";

export default function LoadingOverlay() {
  const { loading, showLoading, hideLoading } = useLoading();

  if (!loading) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#FFC4C4" />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent background
  },
});