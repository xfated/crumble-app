import { StyleSheet } from "react-native";

export const themeStyle = StyleSheet.create({
    screenContainer: {
        width: "100%",
        height: "100%",
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
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
        justifyContent: "center",
        alignItems: "center",
        borderColor: "grey",
        borderWidth: 1
    },
    buttonText: {
        fontSize: 16,
    },
    // Input Text
    textInput: {
        width: "100%",
        height: "100%",
        borderRadius: 4,
        backgroundColor: 'rgba(242, 237, 194, 0.5)',
        borderColor: '#d19f2a',
        borderWidth: 1,
        padding: 14,
        color: "black"
    },
    // Dropdown
    dropdownContainer: {
        width: "100%",
        height: "100%",
        flexDirection: "row",
        alignItems: "center"
    },
    dropdownLabel: {
        width: "100%",
        fontSize: 14,
        fontWeight: "500"
    },
    dropDownButton: {
        width: "100%",
        height: "100%",
        borderRadius: 4,
        backgroundColor: 'rgba(242, 237, 194, 0.5)',
        borderColor: '#d19f2a',
        borderWidth: 1,
        padding: 4
    },
    dropDownButtonText: {
        fontSize: 14,
    },
    dropDownOption: {
        backgroundColor: 'rgba(242, 237, 194, 0.5)',
    },
    dropDownOptionText: {
        fontSize: 14,
    },

    // Bold text
    boldText: {
        fontWeight: "800"
    }
})
