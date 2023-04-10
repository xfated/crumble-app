import { Pressable, Text } from "react-native";
import { themeStyle } from "../homepage/styles";

interface ButtonProps {
    title: string,
    onPress: (input: any) => any
}

const CustomButton: React.FC<ButtonProps> = ({title, onPress}) => {
    return (
        <Pressable style={themeStyle.button} onPress={onPress}>
            <Text style={themeStyle.buttonText}>{title}</Text>
        </Pressable>
    )
}

export default CustomButton;