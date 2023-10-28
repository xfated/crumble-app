import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (key: string, value: string) => {
    try {
        await AsyncStorage.setItem(`@${key}`, value)
    } catch (e) {
        console.error(`Error saving data to async storage: ${e}`)
    }
}

const getData = async (key: string) => {
    try {
        const value = await AsyncStorage.getItem(`@${key}`)
        return value // null if not previously stored
    } catch (e) {
        console.error(`Error reading data to async storage: ${e}`)
    }
}

const clearData = async(key: string) => {
    try {
        await AsyncStorage.removeItem(`@${key}`)
    } catch (e) {
        console.error(`Error removing data from async storage: ${e}`)
    }
}



export const storage = {
    storeData,
    getData,
    clearData
}