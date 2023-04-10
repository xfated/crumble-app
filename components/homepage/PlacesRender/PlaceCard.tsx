import { View, Text, StyleSheet } from "react-native";
import { PlaceDetailRow } from "../../../services/places/interfaces";

interface PlaceCardProps {
    place: PlaceDetailRow
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
    
    return (
        <View>
            <View style={styles.placeCardContainer}>
                <Text>{place.name}</Text>
            </View>
        </View>
    )
}

export default PlaceCard;

const styles = StyleSheet.create({
    placeCardContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
})