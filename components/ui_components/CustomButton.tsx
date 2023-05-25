import { View, Pressable, Text, useWindowDimensions, StyleSheet } from "react-native";

interface ButtonProps {
    title: string,
    onPress: (input: any) => any
    disabled?: boolean
}

const CustomButton: React.FC<ButtonProps> = ({
    title,
    onPress,
    disabled = false
}) => {
    const {fontScale} = useWindowDimensions()
    const styles = makeStyle(fontScale)
    return (
        <View>
            { disabled ? 
                <Pressable style={styles.disabledButton} 
                    disabled={disabled}
                    onPress={onPress}>
                    <Text style={styles.disabledButtonText}>{title}</Text>
                </Pressable>
                :
                <Pressable style={styles.button} 
                    disabled={disabled}
                    onPress={onPress}>
                    <Text style={styles.buttonText}>{title}</Text>
                </Pressable>
            }
        </View>
    )
}

export default CustomButton;

const makeStyle = (fontScale: number) => StyleSheet.create({
    // Button
    button: {
        backgroundColor: "#f2da96",
        borderRadius: 5,
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        borderColor: "grey",
        borderWidth: 1,
    },
    disabledButton: {
        backgroundColor: "#f2e4c7",
        borderRadius: 5,
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        borderColor: "grey",
        borderWidth: 1,
    },
    buttonText: {
        fontSize: 16 / fontScale,
    },
    disabledButtonText: {
        fontSize: 16 / fontScale,
        color: "grey"
    }
})