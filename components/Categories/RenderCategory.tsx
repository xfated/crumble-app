import { StyleSheet, Text, View, TouchableOpacity, useWindowDimensions } from "react-native"
import { CategoryInfo } from "./Categories"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface RenderCategoryProps {
    categoryInfo: CategoryInfo
}

export const RenderCategory: React.FC<RenderCategoryProps> = ({ categoryInfo }) => {
    const {fontScale} = useWindowDimensions()
    const styles = makeStyles(fontScale)

    return (
            <View style={{
                ...styles.buttonContainer,
                backgroundColor: categoryInfo.backgroundColor
            }}>
                <View style={styles.iconContainer}>
                    <MaterialCommunityIcons name={categoryInfo.icon} size={25 / fontScale} color={categoryInfo.textColor} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={{
                        ...styles.text,
                        color: categoryInfo.textColor,
                        fontSize: (categoryInfo.displayName.length > 10 ? 12 : 13) / fontScale
                    }}>{categoryInfo.displayName}</Text>
                </View>
            </View>
    )
}

const makeStyles = (fontScale: number) => StyleSheet.create({
    buttonContainer: {
        height: "90%",
        aspectRatio: 1,
        padding: 2,
        margin: 4,
        borderRadius: 10,
    },
    iconContainer: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center"
    },
    textContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        color: "white",        
        fontWeight: "900",
    }
})