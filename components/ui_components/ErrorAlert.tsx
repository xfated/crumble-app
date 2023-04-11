import { Alert } from 'react-native'

export const createErrorAlert = (errMessage: string) => {
    Alert.alert("Error", errMessage), [
        {
            text: "OK"
        }
    ]
}