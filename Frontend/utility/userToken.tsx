import AsyncStorage from "@react-native-async-storage/async-storage";

// Key: 'token"
// Value: Actual token string
export const setToken = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error("Error setting item:", error);
  }
};

export const getToken = async (key: string) => {
  try {
    const value: string | null = await AsyncStorage.getItem(key);
    return value;
  } catch (error) {
    console.error("Error getting item:", error);
    return null;
  }
};

export const removeToken = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error("Error removing item:", error);
    return false;
  }
};
