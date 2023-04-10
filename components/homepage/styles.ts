import { StyleSheet } from "react-native";

export const themeStyle = StyleSheet.create({
    screenContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
        backgroundColor: "rgba(255,0,0,0.3)"
    },
    fitContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    // Button
    button: {
        backgroundColor: "#f2da96",
        padding: 12,
        borderRadius: 5,
        margin: 9,
    },
    buttonText: {
        fontSize: 16,
    },
    // Input Text
    textInput: {
        width: 150,
        borderRadius: 4,
        backgroundColor: 'rgba(242, 237, 194, 0.5)',
        borderColor: '#d19f2a',
        borderWidth: 1,
        padding: 14,
        color: "black"
    }
})
