import { Alert } from 'react-native'

export const createActionAlert = (title: string, message: string, actionCallback: () => void) => {
    Alert.alert(title, message, [ 
            {
                text: "NO", 
                onPress: () => {},
                style: 'cancel'
            },
            {
                text: "OK", onPress: () => actionCallback()
            }
        ]
    )
}