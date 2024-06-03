import AsyncStorage from '@react-native-async-storage/async-storage';

// key: username associated with token
// arg: token string itself 
export const setItem = async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting item:', error);
    }
  };

export const getItem = async (key: string) => {
    try {
        const value: string | null = await AsyncStorage.getItem(key);
        return value;
    } catch (error) {
        console.error('Error getting item:', error);
        return null; 
    }
}