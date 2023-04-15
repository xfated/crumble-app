import { Pressable, Text, useWindowDimensions, StyleSheet } from "react-native";

interface ButtonProps {
    title: string,
    onPress: (input: any) => any
}

const CustomButton: React.FC<ButtonProps> = ({title, onPress}) => {
    const {fontScale} = useWindowDimensions()
    const styles = makeStyle(fontScale)
    return (
        <Pressable style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{title}</Text>
        </Pressable>
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
    buttonText: {
        fontSize: 16 / fontScale,
    },
})