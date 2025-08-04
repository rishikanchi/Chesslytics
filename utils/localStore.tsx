import AsyncStorage from "@react-native-async-storage/async-storage";

// Save data
export const storeData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.log("Saving error:", e);
  }
};

// Get data
export const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (e) {
    console.log("Reading error:", e);
  }
};

export const setLocalId = async (id: number) => {
  try {
    await storeData("Id", id.toString()); // ✅ await here
  } catch (e) {
    console.log("Id saving error:", e);
  }
};

export const getLocalId = async () => {
  try {
    const id = await getData("Id"); // ✅ await here
    return id != null ? parseInt(id) : null;
  } catch (e) {
    console.log("Local not logged in and Id not found:", e);
  }
};

export const removeLocalId = async () => {
  try {
    await AsyncStorage.removeItem("Id");
  } catch (e) {
    console.log("Error removing local ID:", e);
  }
};
