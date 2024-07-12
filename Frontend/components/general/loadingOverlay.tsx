import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useLoading } from "@/hooks/useLoading";

export default function LoadingOverlay() {
  const { loading, showLoading, hideLoading } = useLoading();
  const navigation: any = useNavigation();

  useEffect(() => {
    if (loading) {
      const timeout = setTimeout(() => {
        hideLoading();
        navigation.navigate("login"); // Redirect user to login page after 30 seconds
      }, 30000); 

      return () => clearTimeout(timeout);
    }
  }, [loading]);


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