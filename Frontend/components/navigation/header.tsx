import React from 'react';
import {StyleSheet, Text, View} from 'react-native'; 
import Ionicons from '@expo/vector-icons/Ionicons';

// Fix the any later based on ChatGPT 
export default function Header({ navigation }: any) {
    const syncData = () => {
      // Will update this to sync data with Strava in future
      console.log("Placeholder!")
    }
  
    const accountPage = () => {
      navigation.navigate('profile'); 
    }
  
    return (
        <View style={styles.header}>
          <View>
            <Ionicons size={25} name="sync" onPress={syncData} style={styles.icons}/>
          </View>
          <View>
            <Text style={styles.headerText}>Workout Wizards!</Text>
          </View>
          <View>
            <Ionicons size={25} name="person-circle-outline" onPress={accountPage} style={styles.icons}/>
          </View>
        </View>
    );
  }

  const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: '100%', 
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#E5E5E5'
    },
  
    headerText: {
        fontFamily: 'inter-bold',
        fontWeight: 'bold',
        fontSize: 17,
        color: "#333",
        letterSpacing: 1,
    },

    icons: {
      paddingTop: 3
    }
  })
  